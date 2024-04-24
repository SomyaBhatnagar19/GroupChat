/* /server/controller/groupController.js */

const Groups = require("../model/groupModel");
const Users = require("../model/userModel");

// function to make group
const makeGroup = async (req, res) => {
  const { name, admins, members } = req.body.groupData;

  try {
    const newGroup = await Groups.create({ name });

    for (let i = 0; i < admins.length; i++) {
      const existingAssociation = await UserGroup.findOne({
        where: { userId: admins[i], groupId: newGroup.id },
      });
      if (!existingAssociation) {
        await UserGroup.create({
          userId: admins[i],
          groupId: newGroup.id,
          isAdmin: true,
        });
      }
    }

    for (let j = 0; j < members.length; j++) {
      const existingAssociation = await UserGroup.findOne({
        where: { userId: members[j], groupId: newGroup.id },
      });
      if (!existingAssociation) {
        await UserGroup.create({
          userId: members[j],
          groupId: newGroup.id,
          isAdmin: false,
        });
      }
    }

    res.status(201).json({ message: "Group created successfully" });
  } catch (err) {
    console.log("Error creating group:", err);
    res.status(500).json({ message: "Internal server error" });
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
