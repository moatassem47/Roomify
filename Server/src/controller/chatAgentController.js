const mongoose = require("mongoose");
const {callAgent} =require("../agents/agent")
const StartChatSession=async(req,res)=>{
        const {message}=req.body
        const threadID=Date.now().toString()
        console.log(message)
    try{
        const client = mongoose.connection.getClient();

        const response= await callAgent(client,message,threadID)
        res.status(200).json({response,threadID})
    }catch(e){
        console.error(e)
        res.status(500).json(e)
    }
}


const ContinueConversation=async(req,res)=>{
        const {threadID}=req.params
        const {message}=req.body
        console.log(message)
    try{
        const client = mongoose.connection.getClient();
        const response= await callAgent(client,message,threadID)
        res.status(200).json({response})
    }catch(e){
        console.error(e)
        res.status(500).json(e)
    }
}



module.exports={StartChatSession,ContinueConversation}