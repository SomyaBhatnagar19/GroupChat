/* /server/model/intermediateUserGroupConnectModel */

const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Users = require('../model/userModel');
const Groups = require('../model/groupModel');

const IntermediateUserGroupConnectModel = sequelize.define('IntermediateUserGroupConnectModel', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

Users.belongsToMany(Groups,{through : IntermediateUserGroupConnectModel});
Groups.belongsToMany(Users,{through : IntermediateUserGroupConnectModel});

module.exports = IntermediateUserGroupConnectModel;