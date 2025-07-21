const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "de link", // <-- Replace with your real connection string!
    
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  totalPoints: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // use ref for populate!
  points: Number,
  claimedAt: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

// Seed users
app.post("/api/seed", async (req, res) => {
  const defaultUsers = [
    "Rahul",
    "Kamal",
    "Sanak",
    "Amit",
    "Priya",
    "Sita",
    "John",
    "Ali",
    "Sara",
    "Vikas",
  ];
  await User.deleteMany({});
  const users = await User.insertMany(defaultUsers.map((name) => ({ name })));
  res.json(users);
});

// Add new user
app.post("/api/users", async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.json(user);
});

// List all users with ranking
app.get("/api/leaderboard", async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  const leaderboard = users.map((user, i) => ({
    rank: i + 1,
    ...user.toObject(),
  }));
  res.json(leaderboard);
});

// Claim points for a user
app.post("/api/claim", async (req, res) => {
  const userId = req.body.userId;
  const points = Math.floor(Math.random() * 10) + 1;
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalPoints: points } },
    { new: true }
  );
  await new History({ userId, points }).save();
  res.json({ user, points });
});

// Claim history
app.get("/api/history", async (req, res) => {
  const history = await History.find().populate("userId", "name");
  res.json(history);
});

app.listen(5000, () => console.log("Server started on port 5000"));
