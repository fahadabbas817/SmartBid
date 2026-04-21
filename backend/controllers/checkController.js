import asyncHandler from 'express-async-handler';
import Check from '../models/checkModels.js';


  
  // @desc    Get all checks
  // @route   GET /api/checks
  // @access  Public
const getChecks = asyncHandler(async (req, res) => {
  const latestCheck = await Check
    .find({})
    .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (latest first)
    .limit(1) // Limit the result to one record
    .exec();

  res.json(latestCheck);
});
  

  // @desc    Update a check
  // @route   PUT /api/checks
  // @access  Public
  const updateCheck = async (req, res) => {
    try {
      // Find the latest record using the createdAt field in descending order
      const latestRecord = await Check.findOne().sort({ createdAt: -1 });
  
      if (!latestRecord) {
        return res.status(404).json({ message: 'No records found.' });
      }
  
      // Update the values of the latest record
      latestRecord.isCheck = req.body.isCheck !== undefined ? req.body.isCheck : false;

  
      // Save the updated record
      const updatedRecord = await latestRecord.save();
  
      res.status(200).json(updatedRecord);
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ message: 'Error updating record.' });
    }
  };

  export { getChecks, updateCheck };
  