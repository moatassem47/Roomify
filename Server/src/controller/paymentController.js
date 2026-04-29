const Cart = require("../model/cartSchema");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");

const createPaymentSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).session(session).populate(
      "items.productId",
      "name price",
    );

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(404).json({ message: "There's no items in your cart" });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      const itemPrice = item.quantity * item.productId.price;
      return (total += itemPrice);
    }, 0);

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      unitPrice: item.productId.price,
    }));

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: { name: item.productId.name },
        unit_amount: item.productId.price * 100,
      },
      quantity: item.quantity,
    }));

    for (const item of cart.items) {
      const updateProduct = await Product.updateOne(
        { _id: item.productId._id, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );

      if (updateProduct.modifiedCount === 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Sorry, there's not enough of ${item.productId.name} in our storage` });
      }
    }

    const order = await Order.create([{
      userId,
      totalAmount,
      shippingAddress,
      items: orderItems,
      paymentMethod,
      status: "Placed",
      paymentStatus: "Pending"
    }], { session });

    cart.items = [];
    await cart.save({ session });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FrontEND_URL}/complete`,
      cancel_url: `${process.env.FrontEND_URL}/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), 
      metadata: {
        orderId: order[0]._id.toString()
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
    return res.status(500).json({ name: e.name, message: e.message });
  } finally {
    session.endSession();
  }
};



const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const stripeSessionData = event.data.object;
            const orderId = stripeSessionData.metadata.orderId;

            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: "Completed"
                });
            }
        } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
            const stripeSessionData = event.data.object;
            const orderId = stripeSessionData.metadata.orderId;

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


