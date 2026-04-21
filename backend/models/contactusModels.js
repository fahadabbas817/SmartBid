import mongoose from 'mongoose'

const contactusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
});

const contactus = mongoose.model('Contactus', contactusSchema);

export default contactus;
