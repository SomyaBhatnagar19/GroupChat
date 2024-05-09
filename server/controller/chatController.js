/* /server/controller/chatController.js */
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const sequelize = require("../util/database");
const {Op} = require("sequelize");
const AWS = require("aws-sdk");
const fs = require("fs");


AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = (fileData, fileName) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileData,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file to S3:', err);
        reject(err);
      } else {
        console.log('File uploaded successfully:', data);
        resolve(data);
      }
    });
  });
};


//sending msgs for normal chat
const sendMessage = async (req, res, next) => {
  try {
    console.log(req.user, req.body);
    await Chat.create({
      userName: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      isShared : true
      
    });
    
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};


const sendFile = async (req, res) => {
  try {

      const user = await User.findByPk(req.user.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

   //console.log("req object : ",req.body,req.user.dataValues);

      console.log("name is : ",req.user.name);

      const file = req.file;

      console.log("file is :",file);

      const fileName = new Date().toISOString() + file.originalname;
      const mimeType = file.mimetype;

      // Read the file data
      //const fileData = fs.readFileSync(file.path);
      const fileData = file.buffer;

      const data = await uploadToS3(fileData, fileName); // Assuming uploadToS3 is defined elsewhere


      if(req.body.groupId) {
          const chats = await Chat.create({
              message: data.Location,
              global: false,
              userId: req.user.id,
              groupId : req.body.groupId,
              userName: req.user.name,
              type: mimeType,
          });
          
         //fs.unlinkSync(file.path);

          return res.status(200).json({ message: "success", chats: chats });
      }
      else{
          const chats = await Chat.create({
              message: data.Location,
              global: true,
              userId: req.user.id,
              userName: req.user.name,
              type: mimeType,
          });

          //fs.unlinkSync(file.path);

          return res.status(200).json({ message: "success", chats: chats });
      }


  } catch (err) {
      console.log("Error occurred while inserting chat into db:", err);
      return res.status(400).json({ message: "failure", errMsg: err });
  }
};



const sendGroupMessages = async (req, res, next) => {
  try {
   

    const {message,isShared,userId,groupId,name} = req.body;


    console.log("data to be added in the table : ",{
      message: message,
      isShared : isShared,
      userId: userId,
      groupId: groupId,
      userName: name,
    });

    const groupSendMessages = await Chat.create({
      message: message,
      isShared : isShared,
      userId: userId,
      groupId: groupId,
      userName: name,
    });
    
    return res.status(200).json({ message: "Success!", groupMessages:  groupSendMessages });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};


//sending msgs for group chat
const getGroupChatMessages = async (req, res, next) => {
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

module.exports = {sendMessage,sendGroupMessages,getGroupChatMessages,sendFile }


