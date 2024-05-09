/* /server/routes/chatRouter.js */

const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userAuthentication = require("../middleware/auth");


router.post("/sendMessage", userAuthentication, chatController.sendMessage);    
router.post("/sendGroupMessages", userAuthentication, chatController.sendGroupMessages); 
router.get('/getGroupChatMessages', chatController.getGroupChatMessages);
router.post("/sendFile", userAuthentication,upload.single("file"),chatController.sendFile);

module.exports = router;