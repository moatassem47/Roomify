const express=require("express");
const dotenv=require("dotenv").config()
const connectDB=require("./config/db")
const productRouter=require("./routes/productRoutes")
const adminRouter=require("./routes/adminRoutes")
const authRouter=require("./routes/authRoutes")
const orderRouter=require("./routes/orderRoutes")
const deliveryRouter=require("./routes/deliveryRoutes")
const userRouter=require("./routes/userRoutes")
const chatRouter=require("./routes/chatRoutes")
const app=express();
const cors = require('cors');
const cookiesParser=require("cookie-parser")
const { stripeWebhook } = require("./controller/paymentController");
const passport = require("passport");
const chatAgentController=require("./controller/chatAgentController")
require("./middleware/loginWithGoogle");

const allowedOrigins = [
    process.env.FrontEND_URL,
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean)


app.post('/order/webhook', express.raw({ type: 'application/json' }), stripeWebhook);


 
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(passport.initialize());

//Routes
app.get("/",(req,res)=>{
    
    res.send(`<h1>Hello form backend server<h1/>
        <p>Server is running<p/>
        `)
})

app.get("/checkout", (req, res) => {
    res.render("checkout");
});

app.use("/chatBot",chatRouter)
app.use("/products",productRouter)
app.use("/admin",adminRouter)
app.use("/auth",authRouter)
app.use("/order",orderRouter)
app.use("/delivery",deliveryRouter)
app.use("/user",userRouter)



const PORT=process.env.PORT || 4000

const startServer=async()=>{
    await connectDB()
    app.listen(PORT,()=>{
        console.log(`Server is open on http://localhost:${PORT}`);
    })
}

startServer()
