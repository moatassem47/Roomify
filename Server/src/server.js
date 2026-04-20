const express=require("express");
const dotenv=require("dotenv").config()

const app=express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Routes
app.get("/",(req,res)=>{
    
    res.send(`<h1>Hello form backend server<h1/>
        <p>Server is running<p/>
        `)
})


const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is open on http://localhost:${PORT}`);
})