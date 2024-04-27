/* /server/routes/chatRouter.js */

const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const userAuthentication = require("../middleware/auth");
const { threadId } = require("worker_threads");

router.post("/sendMessage", userAuthentication, chatController.sendMessage);    
router.post("/sendGroupChatMessage/:groupId", userAuthentication, chatController.sendGroupChatMessage); 
router.get('/getMessages', chatController.getMessages);
router.get('/getGroupChatMessages', chatController.getGroupChatMessages);

module.exports = router;