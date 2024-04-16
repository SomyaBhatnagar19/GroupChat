/* /server/routes/userRouter.js */

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/signup', userController.postUserSignUp);
router.post('/login', userController.postUserLogin);

module.exports = router;
