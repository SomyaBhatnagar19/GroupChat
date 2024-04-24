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
const groupRouter = require('./routes/groupRouter');
const userGroupConnectionRouter = require('./routes/intermediateUserGroupConnectionRouter');
app.use('/', userRouter);
app.use('/chat', chatRouter);
app.use('/group', groupRouter);
app.use('/connection', userGroupConnectionRouter);
// app.get('/', (req, res) => {
//     res.send('Welcome to your server!!');
// });

//Model
const User = require('./model/userModel');
const Chat = require('./model/chatModel');
const Group = require('./model/groupModel');
const UserGroupConnection = require('./model/intermediateUserGroupConnectModel');

//Assosiations
// User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
// Chat.belongsTo(User);
// Group.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
// Chat.belongsTo(Group);

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
