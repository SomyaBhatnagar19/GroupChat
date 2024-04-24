/* /server/model/groupModel.js */

const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const Users = require('./userModel');

const Group = sequelize.define("groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

Group.belongsToMany(Users, { through: "IntermediateUserGroupConnectModel"});

module.exports = Group;