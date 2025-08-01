const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/adminMiddleware');
const {
  promoteUser,
  demoteUser,
  deleteUser
} = require('../controllers/adminUserController');

// Promote to admin
router.put('/promote/:userId', verifyAdmin, promoteUser);

// Demote from admin
router.put('/demote/:userId', verifyAdmin, demoteUser);

// Delete user
router.delete('/delete/:userId', verifyAdmin, deleteUser);

module.exports = router;