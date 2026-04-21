import asyncHandler from 'express-async-handler';
import contactus from '../models/contactusModels.js'

// POST /api/contact
const contactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, text } = req.body;

  // Check if required fields are submitted
  if (!name || !email || !subject || !text) {
    throw new Error('Please fill in all required fields...');
  }

  // Create a new contact form entry
  const contact = new contactus({
    name,
    email,
    subject,
    text,
  });

  // Create a new contact form entry
  const contactForm = new contactus({ name, email, subject, text });

  // Save the contact form to the database
  await contactForm.save();

  res.status(201).json({ message: 'Contact form submitted successfully!' });
});


  // @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const users = await contactus.find({})
  res.json(users)
})

export {contactForm,getContactMessages}