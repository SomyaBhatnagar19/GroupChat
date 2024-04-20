/* /server/server.js */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database");
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
app.use('/', userRouter);
app.use('/chat', chatRouter);

// app.get('/', (req, res) => {
//     res.send('Welcome to your server!!');
// });

//Model
const User = require('./model/userModel');
const Chat = require('./model/chatModel');
//Assosiations
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized.');
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });
