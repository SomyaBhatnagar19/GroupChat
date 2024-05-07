/* /server/routers/groupRouter.js */

const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");

router.post("/makeGroup", groupController.makeGroup);
router.get("/getAllUsers", groupController.getAllUsers);
router.get("/getAllGroups/:userId", groupController.getAllGroups);
router.put("/addUserToGroup", groupController.addUserToGroup);
// router.put("/makeMemberAdmin", groupController.makeMemberAdmin);
// router.delete("/removeUserFromGroup", groupController.removeUserFromGroup);

module.exports = router;
