import asyncHandler from 'express-async-handler';
import auctionDetails from '../models/auctionpriceModels.js'

// POST /api/contact
const auctionForm = asyncHandler(async (req, res) => {
  const { name, baseprice } = req.body;

  // Check if required fields are submitted
  if (!name,!baseprice) {
    throw new Error('Please fill in all required fields...');
  }
  

  // Create a new contact form entry
  const auction = new auctionDetails({ name,baseprice });

  // Save the contact form to the database
  await auction.save();

  res.status(201).json({ message: 'Contact form submitted successfully!' });
});

const getLatestAuction = asyncHandler(async (req, res) => {
  const latestAuction = await auctionDetails
    .find({})
    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (latest first)
    .limit(1) // Limit the result to one record
    .exec();

  res.json(latestAuction);
});


export {auctionForm,getLatestAuction}