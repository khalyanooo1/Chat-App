
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Use Environment Variable for Frontend CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Chat App Backend is Running!");
});

// ✅ **MongoDB Connection**
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ **User Model**
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    online: { type: Boolean, default: false }, // Track online status
  })
);

// ✅ **Chat Message Model**
const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  })
);

// ✅ **Middleware**
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// ✅ **User Authentication Routes**
const authRouter = express.Router();
app.use("/api/auth", authRouter);

// ✅ **Signup Route**
authRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    console.log("✅ New User Registered:", username);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ✅ **Login Route**
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User Logged In:", user.username);
    res.json({
      userId: user._id,
      username: user.username,
      token: "dummy-token-for-session",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// ✅ **API to Get All Users**
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username online");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ **API to Get Messages Between Two Users**
app.get("/api/messages/:sender/:receiver", async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort("timestamp");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// ✅ **WebSocket for Real-Time Chat**
io.on("connection", (socket) => {
  console.log("✅ New Client Connected:", socket.id);

  // ✅ Store the connected user in the socket
  socket.on("user-online", async (username) => {
    console.log(`✅ ${username} is now online`);
    socket.username = username; // Store the username in the socket session
    await User.findOneAndUpdate({ username }, { online: true });
    io.emit("update-users");
  });

  // ✅ Handle Incoming Messages
  socket.on("send-message", async ({ sender, receiver, message }) => {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    console.log(`📩 New Message from ${sender} to ${receiver}: ${message}`);

    // ✅ Emit message only to sender & receiver
    io.to(socket.id).emit("new-message", { sender, receiver, message, timestamp: new Date() });
    socket.broadcast.emit("new-message", { sender, receiver, message, timestamp: new Date() });
  });

  // ✅ Handle User Disconnect
  socket.on("disconnect", async () => {
    console.log("❌ Client Disconnected:", socket.id);
    if (socket.username) {
      await User.findOneAndUpdate({ username: socket.username }, { online: false });
      io.emit("update-users");
    }
  });
});

// ✅ **Start Server**
const PORT = process.env.PORT || 7070;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
