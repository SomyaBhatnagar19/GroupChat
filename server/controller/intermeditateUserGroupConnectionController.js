/* /server/controller/intermediateUserGroupConnectionController.js */

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const UserGroups = require("../model/intermediateUserGroupConnectModel");
const Users = require("../model/userModel");
const { Sequelize } = require("sequelize");

const getMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId; 

    const allMembers = await UserGroups.findAll({
      where: { groupId: groupId },
    });

    console.log(allMembers);

    const userIds = allMembers.map((member) => member.userId);

    const newMembersToAdd = await Users.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: userIds,
        },
      },
    });

    res.status(200).json({ newMembersToAdd });
  } catch (err) {
    console.log("Error fetching new members:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdminsToAdd = async (req, res) => {
  try {
    const { groupId } = req.params;

    const usersWithoutAdminRole = await UserGroups.findAll({
      where: { groupId: groupId, isAdmin: false },
    });

    const userIds = usersWithoutAdminRole.map((user) => user.userId);

    const newAdminsToAdd = await Users.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: userIds,
        },
      },
    });

    console.log("New admins to be added:", newAdminsToAdd);

    res.status(200).json({ newAdminsToAdd });
  } catch (err) {
    console.log("Error fetching new admins to add:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAdminDetails = async (req, res) => {
  try {
    const { userId, groupId } = req.query;

    const adminData = await UserGroups.findAll({
      where: { groupId: groupId, userId: userId },
    });

    res.status(200).json({ adminData: adminData });
  } catch (err) {
    res.status(400).json({ errMsg: err });
  }
};

const addNewUsersToGroup = async (req, res) => {
  try {
    const { admins, members, groupId } = req.body.newMembersData;

    console.log(
      "Req.body in addNewUsersToUserGroups fn :  ",
      req.body.admins,
      req.body.members
    );
    await Promise.all(
      admins.map(async (adminId) => {
        await UserGroups.create({ userId: adminId, isAdmin: true, groupId });
      })
    );

    await Promise.all(
      members.map(async (memberId) => {
        await UserGroups.create({ userId: memberId, isAdmin: false, groupId });
      })
    );

    res
      .status(200)
      .json({ message: "New users added to user groups successfully." });
  } catch (err) {
    console.log("Error adding new users to user groups:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMembers,
  getAdminDetails,
  getAllAdminsToAdd,
  addNewUsersToGroup,
};
