/* /server/controller/groupController.js */

const Groups = require("../model/groupModel");
const Users = require("../model/userModel");
const UserGroup = require('../model/intermediateUserGroupConnectModel');
const { Sequelize } = require('sequelize');


// function to make group
const makeGroup = async (req, res) => {
  const { groupName, admin, members } = req.body.groupData;

  try {
      // Include admin in the members array if not already present
      if (!members.includes(admin)) {
          members.push(admin);
      }

      // Create the group
      const newGroup = await Groups.create({ groupName });

      // Associate admins and members with the group
      for (let i = 0; i < members.length; i++) {
          const userId = members[i];
          const isAdmin = userId === admin;

          // Check if the association already exists
          const existingAssociation = await UserGroup.findOne({
              where: { userId, groupId: newGroup.id }
          });

          if (!existingAssociation) {
              await UserGroup.create({ userId, groupId: newGroup.id, isAdmin });
          }
      }

      res.status(201).json({ message: 'Group created successfully' });
  } catch (err) {
      console.log('Error creating group:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};

//function to fetch all the users
const getAllGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await UserGroup.findAll({ where: { userId: userId } });

    const groupIds = data.map((item) => item.groupId);

    const groups = await Groups.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: groupIds,
        },
      },
    });

    return res.status(200).json({ groups: groups });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "Unable to find groups", errMsg: err });
  }
};



// function to fetch users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: ["id", "name"] });
    res.status(200).json({ users });
  } catch (err) {
    console.log("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to add a user to a group
const addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Groups.findByPk(groupId); // Check if group exists

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    await intermediateUserGroupConnectModel.create({
      userId: userId,
      groupId: groupId,
      isAdmin: false, // Set isAdmin to false by default
    });

    res.status(200).json({ message: "User added to group successfully" });
  } catch (err) {
    console.log("Error adding user to group:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};





module.exports = { makeGroup, getAllGroups, getAllUsers, addUserToGroup};
