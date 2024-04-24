/* /server/routes/userRouter.js */

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.postUserSignUp);
router.post('/login', userController.postUserLogin);
router.get("/:userId",userController.getUserNameByUserId);

module.exports = router;
