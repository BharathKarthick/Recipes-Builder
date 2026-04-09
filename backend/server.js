const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 429, message: "Too many requests, please try again after 15 minutes" },
});
app.use(generalLimiter);

// Stricter limiter for auth routes — prevents brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { status: 429, message: "Too many login/register attempts, please try again after 15 minutes" },
});
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
const authRoutes        = require('./routes/authRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const adminRecipeRoutes = require('./routes/adminRecipeRoutes');
const userRecipeRoutes  = require('./routes/userRecipeRoutes');
const contactRoutes     = require('./routes/contactRoutes');
const searchRoutes      = require('./routes/searchRoutes');
const likeRoutes        = require('./routes/likeRoutes');
const favoriteRoutes    = require("./routes/favoriteRoutes");
const reviewRoutes      = require('./routes/reviewRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/admin/recipes', adminRecipeRoutes);
app.use('/api/user',          userRecipeRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/search',        searchRoutes);
app.use('/api/likes',         likeRoutes);
app.use('/api/favorites',     favoriteRoutes);
app.use('/api/reviews',       reviewRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'recipeApp' })
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected — Using DB: ${dbName}`);
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get('/', (req, res) => res.send('Backend is running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));