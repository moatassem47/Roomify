const express=require("express");
const dotenv=require("dotenv").config()
const connectDB=require("./config/db")
const productRouter=require("./routes/productRoutes")
const adminRouter=require("./routes/adminRoutes")
const authRouter=require("./routes/authRoutes")
const cartRouter=require("./routes/cartRoutes")
const orderRouter=require("./routes/orderRoutes")
const deliveryRouter=require("./routes/deliveryRoutes")
const userRouter=require("./routes/userRoutes")
const app=express();
const cors = require('cors');
const cookiesParser=require("cookie-parser")
const { stripeWebhook } = require("./controller/paymentController");


connectDB()

app.post('/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


 
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))

//Routes
app.get("/",(req,res)=>{
    
    res.send(`<h1>Hello form backend server<h1/>
        <p>Server is running<p/>
        `)
})

app.get("/checkout", (req, res) => {
    res.render("checkout");
});



app.use("/products",productRouter)
app.use("/admin",adminRouter)
app.use("/auth",authRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)
app.use("/delivery",deliveryRouter)
app.use("/user",userRouter)



const PORT=process.env.PORT
app.listen(PORT,()=>{
    try{
        console.log(`Server is open on http://localhost:${PORT}`);
    }catch(e){
        console.log(e);
        
    }
})