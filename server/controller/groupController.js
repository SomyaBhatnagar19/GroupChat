/* /server/controller/groupController.js */

const Groups = require("../model/groupModel");
const Users = require("../model/userModel");
const intermediateUserGroupConnectModel = require('../model/intermediateUserGroupConnectModel');
const { Sequelize } = require('sequelize');


// function to make group
const makeGroup = async (req, res) => {
  const { groupName, admins, members } = req.body.groupData;


  console.log(req.body.groupData);
  
  if (!groupName || !admins || !members) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const newGroup = await Groups.create({ groupName });


     let v1, v2;

    for (let i = 0; i < admins.length; i++) {
      const existingAssociation = await intermediateUserGroupConnectModel.findOne({
        where: { userId: admins[i], groupId: newGroup.id }
    });
    if (!existingAssociation) {
        await intermediateUserGroupConnectModel.create({ userId: admins[i], groupId: newGroup.id, isAdmin: true });
    }
    }
 
    for (let j = 0; j < members.length; j++) {
      const existingAssociation = await intermediateUserGroupConnectModel.findOne({
        where: { userId: members[j], groupId: newGroup.id }
    });
    if (!existingAssociation) {
        await intermediateUserGroupConnectModel.create({ userId: members[j], groupId: newGroup.id, isAdmin: false });
    }
    }

    res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    console.log("Error creating group:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

//function to fetch all the users
const getAllGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await intermediateUserGroupConnectModel.findAll({ where: { userId: userId } });

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



// // Function to make a member an admin
// const makeMemberAdmin = async (req, res) => {
//   const { groupId, userId } = req.body;

//   try {
//     await intermediateUserGroupConnectModel.update(
//       { isAdmin: true },
//       { where: { groupId: groupId, userId: userId } }
//     );

//     res.status(200).json({ message: "Member designated as admin successfully" });
//   } catch (err) {
//     console.log("Error making member admin:", err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// };

// // Function to remove a user from a group
// const removeUserFromGroup = async (req, res) => {
//   const { groupId, userId } = req.body;

//   try {
//     await intermediateUserGroupConnectModel.destroy({
//       where: { groupId: groupId, userId: userId }
//     });

//     res.status(200).json({ message: "User removed from group successfully" });
//   } catch (err) {
//     console.log("Error removing user from group:", err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// };

// module.exports = { makeGroup, getAllGroups, getAllUsers, addUserToGroup, makeMemberAdmin, removeUserFromGroup };
module.exports = { makeGroup, getAllGroups, getAllUsers, addUserToGroup };
