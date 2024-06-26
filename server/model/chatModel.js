/* /server/model/chatModel.js */

const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const Users = require("./userModel");
const Groups = require("./groupModel");

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isShared: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  message: {
    type: Sequelize.STRING,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "text",
  },
});

Chat.belongsTo(Users);
Chat.belongsTo(Groups);

module.exports = Chat;
