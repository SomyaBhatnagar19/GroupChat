/* /server/controller/groupController.js */

const Groups = require("../model/groupModel");
const Users = require("../model/userModel");
const intermediateUserGroupConnectModel = require('../model/intermediateUserGroupConnectModel');

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
      v1 = await intermediateUserGroupConnectModel.create({
        userId: admins[i],
        groupId: newGroup.id,
        isAdmin: true,
      });
    }
    console.log(v1)
    for (let j = 0; j < members.length; j++) {
      v2 = await intermediateUserGroupConnectModel.create({
        userId: members[j],
        groupId: newGroup.id,
        isAdmin: false,
      });
    }
    console.log(v2)

    res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    console.log("Error creating group:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

//function to fetch all the users
const getAllGroups = async (req, res) => {
  try {
    const groups = await Groups.findAll();

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

module.exports = { makeGroup, getAllGroups, getAllUsers };
