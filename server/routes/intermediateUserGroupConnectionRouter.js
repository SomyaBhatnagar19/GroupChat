/* /server/routes/intermediateUserGroupConnectionRouter.js */

const express = require("express");
const router = express.Router();
const IntermediateUserGroupConnectController = require("../controller/intermeditateUserGroupConnectionController");

router.get("/getMembers/:groupId", IntermediateUserGroupConnectController.getMembers);
router.get("/getAdminDetails", IntermediateUserGroupConnectController.getAdminDetails);
router.get(
  "/getAllAdminsToAdd/:groupId",
  IntermediateUserGroupConnectController.getAllAdminsToAdd
);
router.post(
  "/addNewUsersToUserGroups",
  IntermediateUserGroupConnectController.addNewUsersToGroup
);
router.get(
  "/getAllNewMembers/:groupId",
  IntermediateUserGroupConnectController.getAllNewMembers
);

module.exports = router;
