import mongoose from 'mongoose'

const auctionDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  baseprice: {
    type: String,
    required: true
  }
  
},
{
  timestamps: true,
});

const auctionDetails = mongoose.model('auctionprice', auctionDetailsSchema);

export default auctionDetails;
