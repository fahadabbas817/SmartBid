import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 36;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  let typeFilter = {};
  if (req.query.type === 'auction') {
    typeFilter.auctionMode = true;
  } else if (req.query.type === 'shop') {
    typeFilter.auctionMode = { $ne: true };
  }

  let statusFilter = {};
  const now = new Date();
  if (req.query.status === 'live') {
    statusFilter = {
      $or: [
        { auctionMode: true, isAuctionClosed: false, auctionEndTime: { $gt: now } },
        { auctionMode: false, countInStock: { $gt: 0 } }
      ]
    };
  } else if (req.query.status === 'outOfStock') {
    statusFilter = { auctionMode: false, countInStock: 0 };
  } else if (req.query.status === 'ended') {
    statusFilter = {
      auctionMode: true,
      $or: [
        { isAuctionClosed: true },
        { auctionEndTime: { $lte: now } }
      ]
    };
  }

  const filter = { ...keyword, ...typeFilter, ...statusFilter };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (
      product.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401);
      throw new Error("Not authorized to delete this product");
    }
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || "Sample name",
    price: req.body.price || 0,
    user: req.user._id,
    image: req.body.image || "/images/sample.png",
    brand: req.body.brand || "Sample brand",
    category: req.body.category || "Sample category",
    countInStock: req.body.countInStock || 0,
    numReviews: 0,
    description: req.body.description || "Sample description",
    auctionMode:
      req.body.auctionMode !== undefined ? req.body.auctionMode : false,
    fixedPriceMode:
      req.body.fixedPriceMode !== undefined ? req.body.fixedPriceMode : true,
    startingPrice: req.body.startingPrice || 0,
    currentBid: req.body.startingPrice || 0,
    reservePrice: req.body.reservePrice || 0,
    minimumIncrement: req.body.minimumIncrement || 0,
    auctionEndTime: req.body.auctionEndTime,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    auctionMode,
    fixedPriceMode,
    startingPrice,
    reservePrice,
    minimumIncrement,
    auctionEndTime,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    if (
      product.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401);
      throw new Error("Not authorized to update this product");
    }

    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    // brand is required in schema — preserve existing value if UI doesn't send it
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.auctionMode =
      auctionMode !== undefined ? auctionMode : product.auctionMode;
    product.fixedPriceMode =
      fixedPriceMode !== undefined ? fixedPriceMode : product.fixedPriceMode;
    product.startingPrice = startingPrice !== undefined ? startingPrice : product.startingPrice;
    product.reservePrice = reservePrice !== undefined ? reservePrice : product.reservePrice;
    product.minimumIncrement = minimumIncrement !== undefined ? minimumIncrement : product.minimumIncrement;
    product.auctionEndTime = auctionEndTime || product.auctionEndTime;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

// @desc    Force Manual End Auction
// @route   PUT /api/products/:id/end-auction
// @access  Private/Admin or Seller
const endAuctionEarly = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (
      product.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.status(401);
      throw new Error("Not authorized to forcefully end this auction layout");
    }

    if (product.isAuctionClosed) {
      res.status(400);
      throw new Error("Auction is already securely closed!");
    }

    product.isAuctionClosed = true;
    product.auctionEndTime = Date.now(); // Synchronize the clock
    await product.save();

    // Trigger explicit realtime socket sweep if connected globally
    const io = req.app.get("io");
    if (io) {
      io.to(product._id.toString()).emit("auctionEnded", {
        productId: product._id,
      });
    }

    res.json(product);
  } else {
    res.status(404);
    throw new Error("Target Product not found");
  }
});

// @desc    Fetch products listed by the logged-in seller
// @route   GET /api/products/mine
// @access  Private/Seller or Admin
const getMyProducts = asyncHandler(async (req, res) => {
  const pageSize = 36;
  const page = Number(req.query.pageNumber) || 1;

  const filter = { user: req.user._id };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Republish all ended auctions
// @route   PUT /api/products/republish-auctions
// @access  Private/Admin
const republishAuctions = asyncHandler(async (req, res) => {
  const now = new Date();
  const filter = {
    auctionMode: true,
    $or: [{ isAuctionClosed: true }, { auctionEndTime: { $lte: now } }],
  };

  if (req.body.productIds && req.body.productIds.length > 0) {
    filter._id = { $in: req.body.productIds };
  }

  const productsToRepublish = await Product.find(filter);

  if (productsToRepublish.length === 0) {
    res.status(404);
    throw new Error("No ended auctions found to republish");
  }

  const newEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 24 hours extension

  for (let product of productsToRepublish) {
    product.isAuctionClosed = false;
    product.auctionEndTime = newEndTime;
    product.currentBid = product.startingPrice;
    product.highestBidder = null;
    await product.save();
  }

  res.json({
    message: `${productsToRepublish.length} auctions republished successfully`,
  });
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  endAuctionEarly,
  republishAuctions,
  getMyProducts,
};
