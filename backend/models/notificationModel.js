import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['OUTBID', 'WON', 'LOST', 'SYSTEM', 'ORDER'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // E.g. to point to the auction page or order page
    },
  },
  {
    timestamps: true,
  }
)

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
