const User = require('../models/User');

// ✅ Get all registered users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Never expose passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// ✅ Promote user to admin
exports.promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: `${user.username} promoted to admin.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Demote admin to regular user
exports.demoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = false;
    await user.save();
    res.status(200).json({ message: `${user.username} demoted to regular user.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: `${user.username} has been deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};