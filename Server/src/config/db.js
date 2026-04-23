const mongoose=require("mongoose")
const dotenv=require("dotenv")

const connectDB= async()=>{
 try{
    const url=process.env.MONGO_URI
    await mongoose.connect(url)
    console.log("Database connected"); 
 }catch(e){
    console.log(e.message);
 }
}

module.exports=connectDB