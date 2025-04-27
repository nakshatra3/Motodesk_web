const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const dealer = require("./config/dealer.config");
const InventoryRoute = require("./routes/inventory.route");
const SalesRoute = require("./routes/sales.route");
const PriceRoute = require("./routes/price.route");
const OrderRoute = require("./routes/order.route");
const cors = require("cors");
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 3000;
const secretKey = process.env.SECRET_KEY || 'nex1234'; // Default secret key if not in .env

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/inventory", InventoryRoute);
app.use("/sales", SalesRoute);
app.use("/order", OrderRoute);
app.use("/price", PriceRoute);

// Middleware for verifying token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach decoded token data to req.user
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

// Routes
app.get("/", (req, res) => {
  res.render("landingPage");
});

app.get("/payment", (req, res) => {
  res.render("payment");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Registration route
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, location, username, password } = req.body;

    // Check if the user already exists (by email or username)
    const existingUser = await dealer.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send("Email already in use");
      }
      if (existingUser.username === username) {
        return res.status(400).send("Username already in use");
      }
    }

    // Create new user
    const newUser = new dealer({
      name,
      email,
      phone,
      location,
      username,
      password // Storing plain password (change this to hashed password if needed)
    });

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user.");
  }
});

// Login route
// Login route
app.post("/login", async (req, res) => {
  try {
    const user = await dealer.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("No User Found");
    }

    // Compare password
    const isPasswordMatch = req.body.password === user.password; // Use bcrypt if hashing is implemented
    if (!isPasswordMatch) {
      return res.status(401).send("Incorrect Password");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username, name: user.name }, secretKey, { expiresIn: '1h' });

    // Redirect to dashboard with the token (you can store the token in the session if using a session-based approach)
    res.json({token});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login Failed");
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.render("login");
});

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
