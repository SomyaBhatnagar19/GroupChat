/* /server/server.js */

// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database");
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router
const userRouter = require('./routes/userRouter');
app.use('/', userRouter);

// app.get('/', (req, res) => {
//     res.send('Welcome to your server!!');
// });

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
