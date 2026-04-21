import asyncHandler from 'express-async-handler';
import live from '../models/liveModels.js';
import Bid from '../models/bidModel.js';
import Product from '../models/productModel.js';

// POST /api/live
const liveForm = asyncHandler(async (req, res) => {
  const { email, price } = req.body;

  // Check if required fields are submitted
  if (!price) {
    throw new Error('Please put the bid in the required field...');
  }

  // Create a new live form entry
  const liveForm = new live({ email, price });

  // Save the live form to the database
  await liveForm.save();

  res.status(201).json({ message: 'Bid submitted successfully!' });
});

// GET /api/users
// Private/Admin
const getBidMessages = asyncHandler(async (req, res) => {
  const users = await live.find({});
  res.json(users);
});

// GET /api/latest-record
const getLatestRecord = asyncHandler(async (req, res) => {
  const latestAuction = await live
    .find({})
    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (latest first)
    .limit(1) // Limit the result to one record
    .exec();

  res.json(latestAuction);
});

// DELETE /api/live
const deleteAllRecords = asyncHandler(async (req, res) => {
  await live.deleteMany({});
  res.json({ message: 'All records deleted successfully!' });
});

// POST /api/live/bid
// Private (requires token)
// Performs core bidding logic and enforces Auction increments tracking
const placeBid = asyncHandler(async (req, res) => {
  const { productId, amount } = req.body;

  if (!productId || !amount) {
    res.status(400);
    throw new Error('Please provide both productId and bid amount.');
  }

  // 1. Fetch live Product target
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found in system.');
  }

  // 2. Validate it's actually an auction!
  if (!product.auctionMode) {
    res.status(400);
    throw new Error('Violation: This product is not configured for Live Auction.');
  }

  // 3. Time bounds logic
  const now = Date.now();
  if (product.isAuctionClosed || (product.auctionEndTime && now > new Date(product.auctionEndTime).getTime())) {
    res.status(400);
    throw new Error('Auction Expired: Bidding has been permanently closed for this item.');
  }

  // ANTI-SNIPE DOMAIN: If bid lands in final 30 seconds, dynamically map 30 seconds onto the clock.
  let isTimeExtended = false;
  if (product.auctionEndTime) {
    const timeRemaining = new Date(product.auctionEndTime).getTime() - now;
    if (timeRemaining < 30000) { // 30 seconds window
      product.auctionEndTime = new Date(now + 30000); 
      isTimeExtended = true;
    }
  }

  // 4. Validate Increment Financials!
  const minBidRequired = product.currentBid + (product.minimumIncrement || 0);
  if (amount < minBidRequired) {
    res.status(400);
    throw new Error(`Insufficient Funds: Bid amount must be at least $${minBidRequired} (Current Bid + Minimum Increment).`);
  }

  // Passed perfectly. Save formal Bid tracking database layer:
  const bid = new Bid({
    product: productId,
    user: req.user._id,
    amount: amount,
  });
  await bid.save();

  // Atomically modify global Product constraints
  product.currentBid = amount;
  product.highestBidder = req.user._id;
  await product.save();

  // SECURE WEBSOCKET BROADCAST: Server natively emits the update to the target room
  const io = req.app.get('io');
  if (io) {
    // Only dispatch minimal data. Add auctionEndTime if it was mathematically top-upped.
    const payload = { productId, newBid: amount, user: req.user._id };
    if (isTimeExtended) {
      payload.auctionEndTime = product.auctionEndTime;
      payload.timeExtended = true;
    }
    io.to(productId).emit('bidUpdated', payload);
  }

  res.status(201).json({ message: 'Success! Your bid holds the high ground.', bid });
});

export { liveForm, getBidMessages, getLatestRecord, deleteAllRecords, placeBid };
