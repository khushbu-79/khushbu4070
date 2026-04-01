const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ Connection Error: ", err));

// --- MODELS ---
const Booking = mongoose.model("Booking", new mongoose.Schema({
    name: String, email: String, phone: String, room: String, date: String
}));

const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// --- AUTH ROUTES ---
app.post("/signup", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send("Account Created");
    } catch (err) {
        res.status(400).send("User already exists");
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.status(200).send({ message: "Login Success", user: user.username });
    } else {
        res.status(401).send("Invalid Credentials");
    }
});

// --- BOOKING ROUTE ---
app.post("/book", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(200).send("Booking Successful");
    } catch (err) {
        res.status(500).send("Database Error");
    }
});

app.listen(5000, () => console.log("🚀 Server: http://localhost:5000"));