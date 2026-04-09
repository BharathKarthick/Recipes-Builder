const express = require('express');
const router = express.Router();
const adminOnly = require('../middleware/adminMiddleware');
const {
  createTicket,
  getTickets,
  getTicketById,
  replyToTicket
} = require('../controllers/contactController');

// Public: anyone can submit a ticket
router.post('/', createTicket);

router.get('/',                adminOnly, getTickets);
router.get('/:ticketId',       adminOnly, getTicketById);
router.post('/:ticketId/reply', adminOnly, replyToTicket);

module.exports = router;