/* /server/controller/chatController.js */

const path = require("path");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const sequelize = require("../util/database");

//sending msgs for normal chat
exports.sendMessage = async (req, res, next) => {
  try {
    console.log(req.user, req.body);
    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
    });
    
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

//sending msgs for group chat
exports.sendGroupChatMessage = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    
    console.log(req.user, req.body);

    const groupSendMessages = await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: groupId,
    });
    
    return res.status(200).json({ message: "Success!", groupMessages:  groupSendMessages });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

//fetching msgs for normal chat
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Chat.findAll();
    console.log('Messages get: ', messages);
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
  }
};

//sending msgs for group chat
exports.getGroupChatMessages = async (req, res, next) => {
  try {
    const { groupId, userId } = req.query;
    console.log(groupId, userId);
    const messages = await Chat.findAll({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });
    
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching messages" });
  }
};

