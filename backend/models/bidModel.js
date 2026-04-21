import mongoose from 'mongoose'

const bidSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Bid = mongoose.model('Bid', bidSchema)

export default Bid
