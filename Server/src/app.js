const express=require("express");
const dotenv=require("dotenv").config()
const connectDB=require("./config/db")
const productRouter=require("./routes/productRoute")
const adminRouter=require("./routes/adminRoutes")
const authRouter=require("./routes/authRoute")
const app=express();
const cors = require('cors');
const cookiesParser=require("cookie-parser")


connectDB()

 
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

app.use("/products",productRouter)
app.use("/admin",adminRouter)
app.use("/auth",authRouter)


const PORT=process.env.PORT
app.listen(PORT,()=>{
    try{
        console.log(`Server is open on http://localhost:${PORT}`);
    }catch(e){
        console.log(e);
        
    }
})