/* /server/controller/chatController.js */

const path = require("path");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const sequelize = require("../util/database");

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

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Chat.findAll();
    console.log('Messages get: ', messages);
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
  }
};