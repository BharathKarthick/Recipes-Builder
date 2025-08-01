const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminRecipeRoutes = require('./routes/adminRecipeRoutes');
const userRecipeRoutes = require('./routes/userRecipeRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/recipes', adminRecipeRoutes);
app.use('/api/user', userRecipeRoutes);

// ✅ Connect to MongoDB with dbName option
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'recipeApp'
})
.then(() => {
  console.log("MongoDB Connected to DB");

  // 🔍 Confirm the actual connected DB name
  const dbName = mongoose.connection.name;
  console.log("Using Database:", dbName);
})
.catch((err) => console.error("MongoDB Error:", err));

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});