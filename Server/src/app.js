const express=require("express");
const dotenv=require("dotenv").config()
const connectDB=require("./config/db")
const productRouter=require("./routes/productRoute")
const adminRouter=require("./routes/adminRoutes")
const app=express();
const cors = require('cors');


connectDB()

 
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Routes
app.get("/",(req,res)=>{
    
    res.send(`<h1>Hello form backend server<h1/>
        <p>Server is running<p/>
        `)
})

app.use("/products",productRouter)
app.use("/admin",adminRouter)



const PORT=process.env.PORT
app.listen(PORT,()=>{
    try{
        console.log(`Server is open on http://localhost:${PORT}`);
    }catch(e){
        console.log(e);
        
    }
})