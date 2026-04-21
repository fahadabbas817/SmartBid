import cron from 'node-cron';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// Initializes the task runner universally bound to Node startup
const initCronJobs = (app) => {
  // Run sweep every 60 seconds internally
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Safely index all auctions that shouldn't be active anymore
      const expiredAuctions = await Product.find({
        auctionMode: true,
        isAuctionClosed: false,
        auctionEndTime: { $lte: now }
      });

      if (expiredAuctions.length > 0) {
        console.log(`[Cron Scheduler] Found ${expiredAuctions.length} expired auctions. Commencing sweep...`);
        const io = app.get('io');
        
        for (const product of expiredAuctions) {
          product.isAuctionClosed = true;
          // Formal save locking the user definitively
          await product.save();
          
          if (io) {
             io.to(product._id.toString()).emit('auctionEnded', { productId: product._id });
          }
          console.log(`[Cron Scheduler] Locked and Closed Product Auction: ${product._id}`);

          // FULFILLMENT PIPELINE: Assign to Highest Bidder
          if (product.highestBidder) {
             try {
                const newOrder = new Order({
                  user: product.highestBidder,
                  orderItems: [{
                    name: product.name,
                    qty: 1,
                    image: product.image,
                    price: product.currentBid,
                    isAuctionWin: true,
                    product: product._id,
                    seller: product.user
                  }],
                  shippingAddress: { address: 'TBD', city: 'TBD', postalCode: 'TBD', country: 'TBD' },
                  paymentMethod: 'PayPal',
                  taxPrice: 0.0,
                  shippingPrice: 0.0,
                  totalPrice: product.currentBid,
                  isPaid: false
                });

                await newOrder.save();
                console.log(`[Cron Fulfillment] Successfully generated Unpaid Order Invoice for Product ${product._id} to User ${product.highestBidder}`);
             } catch (orderErr) {
                console.error(`[Cron Fulfillment] Critical Error mapping Order for Product ${product._id}:`, orderErr);
             }
          }
        }
      }
    } catch (error) {
      console.error('[Cron Error] Failed to process expired auctions:', error);
    }
  });

  console.log('Task Scheduler: Background cron job initiated structure.');
};

export default initCronJobs;
