const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// ✅ Create a new contact ticket (public)
exports.createTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ticket = await Contact.create({ name, email, subject, message });

    // Confirmation email to user
    await sendEmail(
      email,
      'We received your message — Recipe Builder',
      `Hello ${name},<br><br>
       We have received your message.<br><br>
       <strong>Subject:</strong> ${subject}<br>
       <strong>Message:</strong> ${message}<br><br>
       <strong>Your Ticket ID:</strong> ${ticket._id}<br><br>
       Our team will get back to you soon.<br><br>
       — Recipe Builder Support`
    );

    // Notification email to admin
    if (process.env.ADMIN_EMAIL) {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'New support ticket — Recipe Builder',
        `You have a new ticket.<br><br>
         <strong>From:</strong> ${name} &lt;${email}&gt;<br>
         <strong>Subject:</strong> ${subject}<br>
         <strong>Message:</strong> ${message}<br><br>
         <strong>Ticket ID:</strong> ${ticket._id}`
      );
    }

    res.status(201).json({ message: 'Ticket created successfully', ticketId: ticket._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all tickets (admin only — protected at route level)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get single ticket by ID (admin only)
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Contact.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Admin replies to a ticket
exports.replyToTicket = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply message is required' });

    const ticket = await Contact.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    await sendEmail(
      ticket.email,
      `Re: ${ticket.subject} — Recipe Builder`,
      `Hello ${ticket.name},<br><br>
       ${reply}<br><br>
       <strong>Ticket ID:</strong> ${ticket._id}<br><br>
       — Recipe Builder Support`
    );

    ticket.status = 'replied';
    await ticket.save();

    res.status(200).json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};