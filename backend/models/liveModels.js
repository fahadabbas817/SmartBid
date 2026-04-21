import mongoose from 'mongoose'

const liveSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
});

const live = mongoose.model('Live', liveSchema);

export default live;
