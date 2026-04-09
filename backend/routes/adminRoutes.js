const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/adminMiddleware');
const {
  getAllUsers,
  promoteUser,
  demoteUser,
  deleteUser
} = require('../controllers/adminUserController');

router.get('/users', verifyAdmin, getAllUsers);

router.put('/promote/:userId', verifyAdmin, promoteUser);
router.put('/demote/:userId', verifyAdmin, demoteUser);
router.delete('/delete/:userId', verifyAdmin, deleteUser);

module.exports = router;