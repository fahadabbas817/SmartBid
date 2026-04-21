SmartBid Completion Tracker
The following issues need to be addressed one by one to complete the Auction module and fulfill the project proposal requirements.

1. Backend: Core Bidding Engine (Critical)
   [ ] Rewrite liveController.js and connect bidModel.js: Bids must be saved into the bidModel.
   [ ] Product Validation: A bid must automatically reject if:
   The bid amount < currentBid + minimumIncrement.
   The current time is past the Product.auctionEndTime.
   [ ] Database Integrity: The Product.currentBid and Product.highestBidder fields must update every time a valid bid goes through.
2. Backend: Securing Socket.io (Critical)
   [ ] Stop Blind Echoing: Currently, server.js listens to placeBid and broadcasts it immediately. It must wait for the database validation step (Issue #1) to return success before blindly emitting to everyone else.
3. Backend: Automated Winner Selection (Critical)
   [ ] Task Scheduler Integration: The system needs a background timer (node-cron or agenda) that constantly monitors active auctions.
   [ ] Automatic Closure: When auctionEndTime is reached, it should update Product.isAuctionClosed to true.
   [ ] Order Generation: Once closed, we need to create a finalized step/notification where the highestBidder is recorded as the winner so they can purchase the item.
4. Backend: Real AI Integration
   [ ] Update aiController.js: The routes exist, but the code literally says // mocked AI text generation and uses Math.random(). We need to integrate a real API (e.g., Google or OpenAI) to generate descriptions and parse imagery to recommend starting prices.
5. Frontend: UI & Integrity Upgrades
   [ ] Real-Time Countdown Timer Component: The frontend should visually calculate auctionEndTime - Date.now() and tick down second-by-second. Once it hits zero, it should grey-out and disable the "Place Bid" button.
   [ ] Robust Error Handling: If a user manages to bypass the UI constraints, but the new backend catches it (Issue #1), the frontend must properly capture and display the backend's 400 Bad Request error instead of quietly failing.
   [ ] Refine BidBox.js Component: Ensure that the WebSocket listens to server-verified confirmation events (bidSuccessful) rather than trusting the user's local keystrokes.
