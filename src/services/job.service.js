import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';

const getAppliedJobsByUserId = async (userID, page, pageSize, skip, limit) => {

  const matchingResults = await Job.countDocuments({
    'candidateList.user': new mongoose.Types.ObjectId(userID),
  });
  const totalPages = Math.ceil(matchingResults / limit);


  const result = await Job.find({
    'candidateList.user': new mongoose.Types.ObjectId(userID),
  }).skip(skip)
    .limit(limit);

  if (!result) {
    return {
      code: 200,
      status: 'success',
      message: `Sorry!! No job applied by ${userID}`,
    };
  }

  return {
    code: 200,
    status: 'success',
    pagination: {
      matchingResults,
      totalPages,
      currentPage: page,
      pageSize: limit,
      returnedResults: result.length,
    },
    data: result,
  };
};

const jobService = { getAppliedJobsByUserId };

export default jobService;
