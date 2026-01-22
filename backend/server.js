const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // The "Home WiFi" fix

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/tasks'); // <--- MAKE SURE THIS IS HERE

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

// Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute); // <--- THIS IS THE MISSING LINK

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});