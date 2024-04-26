/* /server/controller/userController.js */

const bcrypt = require('bcrypt');
const User = require('../model/userModel');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, email) => {
    return jwt.sign({ userId: id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const postUserSignUp = async (req, res, next) => {
  try {
    const { name, number, email, password } = req.body;

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
      number,
      email,
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
  
      const token = generateAccessToken(user.id, user.email);
      console.log('JWT token:', token);
  
      res.status(200).json({ message: 'Login successful!', user: user, token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getUserNameByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log('Error fetching user details:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
  generateAccessToken,
  postUserSignUp,
  postUserLogin,
  getUserNameByUserId,
};
