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
  IntermediateUserGroupConnectController.addNewUsersToUserGroups
);
router.post(
  "/addNewAdminToTheGroup",
  IntermediateUserGroupConnectController.addNewAdminToUserGroups
);
router.get(
  "/getAllNewMembers/:groupId",
  IntermediateUserGroupConnectController.getAllNewMembers
);

router.get("/getAllTheUsersInGroup/:groupId",IntermediateUserGroupConnectController.getAllTheUsersInGroup);

router.post("/removeUserFromTheGroup",IntermediateUserGroupConnectController.removeUserFromTheGroup);

module.exports = router;
