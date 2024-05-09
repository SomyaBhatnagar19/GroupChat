require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const Chats = require("./model/chatModel");

io.on("connection", (socket) => {

  console.log("A user has connected", socket.id);

  // Emit user's online status when they connect

  // Handle getMessage event
  socket.on("getMessage", async () => {
    try {
      // Your logic to fetch messages from the database
      const messages = await Chats.findAll({ where: { isShared: true } });
      io.emit("messages", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  });

  // Handle incoming group messages
  socket.on("getGroupMessage", async (data) => {
    try {
      console.log("data is :", data);

      const groupId = data.groupId;
      const groupName = data.groupName;

      console.log("group id is :", groupId);
      console.log("group name is :", groupName);

      socket.join(groupName); // Join the room identified by the group name

      // Fetch group messages from the database
      const groupmessages = await Chats.findAll({ where: { groupId } });

      console.log("groupmessages are : ", groupmessages);

      // Emit the group messages to all members in the room (group chat)
      io.to(groupName).emit("groupmessages", groupmessages);
    } catch (err) {
      console.log("Error fetching group messages:", err);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
    io.emit("userOnline", { userId: socket.id, status: false });
  });
});

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

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Ensure the job is defined and has a start method
const job = require("./jobs/cron");
if (job && job.start) {
  job.start();
} else {
  console.error("Job is not defined or does not have a start method");
}

sequelize.sync()
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });
