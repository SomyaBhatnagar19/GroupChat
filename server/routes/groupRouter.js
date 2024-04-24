/* /server/routers/groupRouter.js */

const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");

router.post("/makeGroup", groupController.makeGroup);
router.get("/getAllUsers", groupController.getAllUsers);
router.get("/getAllGroups", groupController.getAllGroups);

module.exports = router;
