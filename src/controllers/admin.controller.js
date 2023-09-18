import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';

const getJobList = async (req, res) => {
  const { page, pageSize, skip = 0, limit = 10, filter = {} } = req.query;

  const matchingResults = await Job.countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / limit);
  const jobs = await Job.find(filter)
    .skip(skip)
    .limit(limit)
    .select('-candidateList ')
    .populate('postedBy', 'name');
  res.status(200).json({
    status: 'success',
    pagination: {
      matchingResults,
      totalPages,
      currentPage: page,
      pageSize: limit,
      returnedResults: jobs.length,
    },
    data: jobs,
  });
};
const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    res.json(job);
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Job not Found',
    });
  }
};
const removeJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    job.status = 'removed';
    await job.save();
    res.status(201).json({
      status: 'success',
      messeage: 'Job removed !',
    });
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Job not Found',
    });
  }
};
const adminController = {
  getJobList,
  getJobById,
  removeJobById,
};

export default adminController;
