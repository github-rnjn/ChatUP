const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

const path = require("path")

const connectDatabase = require("./config/db");

const dotenv = require("dotenv");

const userRoutes = require("./routes/user.route");
const chatRoutes = require("./routes/chat.route");
const messageRoutes = require("./routes/message.route");

const { notFound, errorHandler } = require("./middleware/error.middleware");

dotenv.config();
connectDatabase();

app.use(express.json()); // to accept the JSON data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.get("/api/chats", (req, res) => {
    res.send(chats);
});

const server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://127.0.0.1:3000",
    },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on('setup', (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      socket.emit('connected');
    }
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on('typing', ({ room,message }) => {
    socket.to(room).emit("typing", { room, message });
  });

  socket.on("stop typing", ({ room }) => {
    socket.to(room).emit("stop typing", { room });
  });

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
