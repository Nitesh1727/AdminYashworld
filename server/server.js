const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Device = require("./models/device");
const User = require("./models/user");
require("dotenv").config();

const cors = require("cors");

const app = express();
const port = 8006;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());

// Default route
app.get("/", async (req, res) => {
  res.send("Hello from Express!");
});

//admin registering themselves
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with role 'admin'
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Admin registered successfully",
        data: user,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to register admin",
        error: err.message,
      });
  }
});

//middleware
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized. Admin token missing.",
    });
  }
  const tokenValue = token.split(" ")[1];
  
  // Verify the token
  try {
    const secretKey = 'your_secret_key'; // Replace 'your_actual_secret_key' with your JWT secret key
    const decodedToken = jwt.verify(tokenValue, secretKey);
    console.log("decodedToken->", decodedToken);
    
    // Check if the decoded token contains the necessary information
    if (!decodedToken || decodedToken.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid or insufficient permissions.",
      });
    }
    
    // Attach decoded token to the request object
    req.user = decodedToken;
    next(); // Call next middleware
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};


app.post("/registeruser", async (req, res) => {
    try {
        // Check for admin token in the request headers
        const token = req.headers.authorization;
        
        if (!token || !token.startsWith("Bearer ")) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. Admin token missing.",
            });
        }
        const tokenValue = token.split(" ")[1];
        
        // Verify the token
        let decodedToken;
        try {
            const secretKey = 'your_secret_key'; // Replace 'your_actual_secret_key' with your JWT secret key
            decodedToken = jwt.verify(tokenValue, secretKey);
            console.log("decodedToken->", decodedToken);

        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. Invalid token.",
            });
        }

        // Check if the decoded token contains the necessary information
        if (!decodedToken || decodedToken.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. Invalid or insufficient permissions.",
            });
        }
    
        const { username, email, password, phoneNumber, devicesAllocated, status } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let verified = true; // Set verified to true since it's being registered by an admin
    
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            devicesAllocated, // Ensure devicesAllocated is an array
            status,
            role: 'user',
            verified:true
        });
    
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: err.message,
        });
    }
});



//dashboard 5 devices
app.get("/", async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is stored in the request object after authentication
    const latestDevices = await Device.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    res.json({ devices: latestDevices, users: latestUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//admin and user login route
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user;

    if (role === "admin") {
      user = await User.findOne({ email, role: "admin" });
    } else if (role === "user") {
      user = await User.findOne({ email, role: "user" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    // Create a device for the user
    const device = new Device({
      name: "Default Device",
      description: "Default description",
      createdBy: user._id,
    });
    await device.save();

    const tokenPayload = { userId: user._id, role: user.role }; // Include role in the token payload
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
      
    });
    console.log("tokenPayload-->", tokenPayload);
    console.log("token-->", token);
    res.json({
      success: true,
      message: "Login successful",
      userId: user._id,
      token: token,
      role: user.role, // Also include role in the response
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to login", error: err.message });
  }
});

//get all users
app.get("/users", verifyAdminToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});
// Endpoint to update a user
app.put("/users/:userId", verifyAdminToken,async (req, res) => {
  try {
    const userId = req.params.userId;
    const { phoneNumber, devicesAllocated, status } = req.body;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber, devicesAllocated, status },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      });
  }
});

//admin deleting user
app.delete("/users/:userId", verifyAdminToken ,async (req, res) => {
  try {
    

    const userId = req.params.userId;

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
  }
});

// Endpoint for admin to delete all users
app.delete("/users", async (req, res) => {
  try {
    // Check if the requester is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete all users" });
    }

    // Delete all users from the database
    await User.deleteMany();

    res
      .status(200)
      .json({ success: true, message: "All users deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete users",
        error: error.message,
      });
  }
});

app.get('/searchuser', verifyAdminToken, async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.query;
    let query = {};

    // Build query based on provided search parameters
    if (username) {
      query.username = { $regex: new RegExp(username, 'i') }; // Case-insensitive regex search for username
    }
    if (email) {
      query.email = { $regex: new RegExp(email, 'i') }; // Case-insensitive regex search for email
    }
    if (phoneNumber) {
      query.phoneNumber = phoneNumber; // Exact match for phone number
    }

    // Fetch users based on the constructed query
    const users = await User.find(query);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message
    });
  }
});




//for user only
// Authentication middleware to verify user token
const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized. User token missing.",
    });
  }
  const tokenValue = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
    if (!decodedToken || decodedToken.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid or insufficient permissions.",
      });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};

// Route to get user details
app.get("/me", verifyUserToken, async (req, res) => {
  try {
    // Fetch user details using the authenticated user's token
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
