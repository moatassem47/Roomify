const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");
const createStripe = require("stripe");
const mongoose = require("mongoose");
const { buildFrontendUrl } = require("../config/urls");

let stripeClient;

const getStripe = () => {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }

    stripeClient = createStripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
};

const createPaymentSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(404).json({ message: "There's no items in your cart" });
    }

    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    const cartItems = [];
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Product not found" });
      }
      cartItems.push({
        product,
        quantity: Number(item.quantity)
      });
    }

    const totalAmount = cartItems.reduce((total, item) => {
      const itemPrice = item.quantity * item.product.price;
      return (total += itemPrice);
    }, 0);

    const orderItems = cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
      unitPrice: item.product.price,
    }));

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    for (const item of cartItems) {
      const updateProduct = await Product.updateOne(
        { _id: item.product._id, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );

      if (updateProduct.modifiedCount === 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Sorry, there's not enough of ${item.product.name} in our storage` });
      }
    }

    const order = await Order.create([{
      userId,
      totalAmount,
      shippingAddress,
      items: orderItems,
      paymentMethod,
      status: "Placed",
      statusHistory: [{
        status: "Placed",
        date: new Date()
        }],
      paymentStatus: "Pending"
    }], { session });


    const stripeSession = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: buildFrontendUrl(`/checkout/success?orderId=${order[0]._id}`),
      cancel_url: buildFrontendUrl(`/checkout/cancel?orderId=${order[0]._id}`),
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
      metadata: {
        orderId: order[0]._id.toString(),
        userId: userId.toString()
      },
    });

    await Order.updateOne(
      { _id: order[0]._id },
      { stripeSessionId: stripeSession.id },
      { session }
    );

    await session.commitTransaction();
    return res.json({ url: stripeSession.url });
  } catch (e) {
    await session.abortTransaction();
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};



const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`❌ Stripe Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log(`ℹ️ Received Stripe Event: ${event.type}`);

        if (event.type === 'checkout.session.completed') {
            const stripeSessionData = event.data.object;
            const orderId = stripeSessionData.metadata?.orderId;
            const userId = stripeSessionData.metadata?.userId;

            console.log(`ℹ️ Processing checkout.session.completed for Order: ${orderId}, User: ${userId}`);

            if (orderId) {
                const updatedOrder = await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: "Completed"
                }, { new: true });
                
                if (updatedOrder) {
                    console.log(`✅ Successfully updated Order ${orderId} paymentStatus to Completed`);
                } else {
                    console.warn(`⚠️ Order ${orderId} not found in database`);
                }
            } else {
                console.warn(`⚠️ No orderId found in Stripe session metadata`);
            }

            if (userId) {
                console.log(`ℹ️ Stripe checkout completed successfully. Client will clear cart local storage for User ${userId}`);
            } else {
                console.warn(`⚠️ No userId found in Stripe session metadata`);
            }
        } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
            const stripeSessionData = event.data.object;
            const orderId = stripeSessionData.metadata?.orderId;

            console.log(`ℹ️ Processing checkout session expiration/failure for Order: ${orderId}`);

            if (orderId) {
                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    const order = await Order.findById(orderId).session(session);

                    if (order && order.paymentStatus === 'Pending') {
                        order.status = "Cancelled";
                        order.paymentStatus = "Failed";

                        for (const item of order.items) {
                            await Product.updateOne(
                                { _id: item.productId },
                                { $inc: { stockQuantity: +item.quantity } },
                                { session }
                            );
                        }

                        await order.save({ session });
                        console.log(`✅ Successfully marked Order ${orderId} as Failed/Cancelled and restored stock`);
                    } else if (!order) {
                        console.warn(`⚠️ Order ${orderId} not found to expire/fail`);
                    } else {
                        console.log(`ℹ️ Order ${orderId} is not in Pending status, skipping cancel/fail updates`);
                    }
                    await session.commitTransaction();
                } catch (e) {
                    await session.abortTransaction();
                    console.error("URGENT: Stripe Webhook Expired Handler Failed", e);
                } finally {
                    session.endSession();
                }
            }
        }
    } catch (e) {
        console.error("URGENT: Stripe Webhook Processing Failed", e);
    }

    res.status(200).send("Webhook received");
};


module.exports = { createPaymentSession, stripeWebhook };

//stripe listen --forward-to localhost:4000/order/webhook


