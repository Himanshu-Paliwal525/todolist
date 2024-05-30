const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/ToDoApp");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

const itemSchema = new Schema({
    item: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (token) {
        jwt.verify(token, "JWT_SECRET", (err, user) => {
            req.user = user;
            next();
        });
    }
};

app.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });

    await newUser.save();
    const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        "JWT_SECRET"
    );
    res.json({ success: true, token });
});

app.post("/", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.json({ success: false, error: "Invalid User" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.json({ success: false, error: "Invalid Password" });
    }
    const token = jwt.sign(
        { id: user._id, username: user.username },
        "JWT_SECRET",
        { expiresIn: "1h" }
    );
    res.json({ success: true, token });
});

// Get All Items
app.get("/items", authenticateJWT, async (req, res) => {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
});

// Get Item by ID
app.get("/items/:id", authenticateJWT, async (req, res) => {
    const item = await Item.findOne({
        _id: req.params.id,
        userId: req.user.id,
    });
    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
});

app.post("/items", authenticateJWT, async (req, res) => {
    const { item } = req.body;
    const newItem = new Item({ item, userId: req.user.id });
    await newItem.save();
    await User.findByIdAndUpdate(req.user.id, {
        $push: { items: newItem._id },
    });
    res.json(newItem);
});

app.put("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { item } = req.body;
    const updatedItem = await Item.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { item },
        { new: true }
    );
    if (!updatedItem) {
        return res.json({ message: "Item not found" });
    }
    res.json(updatedItem);
});

app.delete("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const deletedItem = await Item.findOneAndDelete({
        _id: id,
        userId: req.user.id,
    });
    if (!deletedItem) {
        return res.json({ message: "Item not found" });
    }
    await User.findByIdAndUpdate(req.user.id, { $pull: { items: id } });
    res.json({ message: "Item deleted successfully", deletedItem });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
