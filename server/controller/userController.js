/* /server/controller/userController.js */

const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const { Op } = require('sequelize');

const postUserSignUp = async (req, res, next) => {
  try {
    const { name, email, number, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { number }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'This email or number is already taken. Please choose another one.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      number,
      password: hashedPassword,
    });

    res.status(200).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const postUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password!' });
    }

    res.status(200).json({ message: 'Login successful!', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  postUserSignUp,
  postUserLogin,
};
