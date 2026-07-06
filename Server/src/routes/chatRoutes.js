const express=require("express")
const router=express.Router()
const {StartChatSession,ContinueConversation}=require("../controller/chatAgentController")


router.post("/",StartChatSession)
router.post("/:threadID",ContinueConversation)




module.exports=router
