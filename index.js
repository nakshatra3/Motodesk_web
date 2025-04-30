const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./config/dealer.config");
const InventoryRoute = require("./routes/inventory.route");
const SalesRoute = require("./routes/sales.route");
const PriceRoute = require("./routes/price.route");
const OrderRoute = require("./routes/order.route");
const customerRoutes = require('./routes/customer.route');
const DealerRoute = require("./routes/dealer.route");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require("cors");
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3002;
const secretKey = process.env.SECRET_KEY || 'nex1234'; // Default secret key if not in .env

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  // Make sure to set these in your .env file
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3002/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // This function gets called after successful authentication
    console.log(profile); // Log profile to see user info
    // Store user information in the session (or your DB)
    return done(null, profile);
  }
));

app.get("/",{
 console.log("Hello Motodesk");
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.set("view engine", "ejs");
app.use(cors({
  origin: "http://localhost:3000", // React app's origin
  credentials: true // Allow cookies/headers if needed
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(session({
  secret: 'your-session-secret', // Use a strong secret key
  resave: false,
  saveUninitialized: true
}));

// Initialize passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/inventory", InventoryRoute);
app.use("/sales", SalesRoute);
app.use("/order", OrderRoute);
app.use("/price", PriceRoute);
app.use("/customer", customerRoutes);
app.use("/dealers", DealerRoute);

// Google OAuth Authentication Routes
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user;
      const userInfo = {
        name: user.displayName,
        email: user.emails[0].value
      };

      // Redirect to React app with user info encoded in URL
      const query = new URLSearchParams(userInfo).toString();
      res.redirect(`http://localhost:3000/dashboard?${query}`);
    } catch (error) {
      console.error("Error during Google authentication:", error);
      res.status(500).send("Something went wrong. Please try again.");
    }
  }
);

// JWT Login Route (Username + Password)
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("No User Found");
    }

    const isPasswordMatch = req.body.password === user.password; // Use bcrypt if hashing is implemented
    if (!isPasswordMatch) {
      return res.status(401).send("Incorrect Password");
    }

    const token = jwt.sign({ userId: user._id, username: user.username, name: user.name }, secretKey, { expiresIn: '1h' });

    // Check if the username is Admin@123
    if (user.username === "Admin@123") {
      return res.json({ token, redirect: '/admin' }); // Include redirect for admin
    }

    res.json({ token, redirect: '/dashboard' }); // Regular user
  } catch (error) {
    res.status(500).send("Login Failed");
  }
});

// Registration Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, location, username, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      if (existingUser.email === email) return res.status(400).send("Email already in use");
      if (existingUser.username === username) return res.status(400).send("Username already in use");
    }

    const newUser = new dealer({
      name, email, phone, location, username, password
    });

    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user.");
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
