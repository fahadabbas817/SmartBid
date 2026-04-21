import mongoose from 'mongoose'

const checkSchema = mongoose.Schema(
  {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);




const Check = mongoose.model('Button', checkSchema)

export default Check
