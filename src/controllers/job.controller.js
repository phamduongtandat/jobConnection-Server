import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import jobService from '../services/job.service.js';

const getAppliedJobsByUserId = async (req, res) => {
  const { userID } = req.params;

  const { page, pageSize, skip = 0, limit = 10 } = req.query;

  const { code, ...data } = await jobService.getAppliedJobsByUserId(
    userID,
    page,
    pageSize,
    skip,
    limit,
  );

  res.status(code).json(data);
};

//       _____ GET JOB LIST _____ 
const getJobList = async (req, res) => {
  const { page, pageSize, skip = 0, limit = 10, sort, field = null, filter = {}, word = '' } = req.query;


  if (!sort) {
    const matchingResults = await Job.countDocuments(filter);
    const totalPages = Math.ceil(matchingResults / limit);

    const jobs = await Job.find(filter)
      .skip(skip)
      .limit(limit)
      .select('-status -candidateList ');

    return res.status(200).json({
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
  }

  if (sort.length !== 2 || !sort.some((i) => i === 'desc' || i === 'asc')) {
    return res.status(400).json({

      status: 'fail',
      message: `Sorry!! Please double check sort key`,
    })
  }

  if (!field) {

    const matchingResults = await Job.find({ '$or': [{ title: { '$regex': word } }, { position: { '$regex': word } }] }).countDocuments(filter);
    const totalPages = Math.ceil(matchingResults / limit);

    const result = await Job
      .find({ '$or': [{ title: { '$regex': word } }, { position: { '$regex': word } }] })
      .sort([sort])
      .skip(skip)
      .limit(limit)
      .select('-status -candidateList ');

    return res.status(200).json({
      status: 'success',
      pagination: {
        matchingResults,
        totalPages,
        currentPage: page,
        pageSize: limit,
        returnedResults: result.length,
      },
      data: result,
    })
  }


  const matchingResults = await Job.find({ '$or': [{ title: { '$regex': word } }, { position: { '$regex': word } }] })
    .find({ field }).countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / limit);
  const result = await Job
    .find({ '$or': [{ title: { '$regex': word } }, { position: { '$regex': word } }] })
    .find({ field })
    .sort([sort])

  if (result.length === 0) {
    return res.status(200).json({

      status: 'success',
      data: result,
      message: `Sorry!! No finding with keyword ${field} và ${word}`,
    })
  }


  return res.status(200).json({

    status: 'success',
    pagination: {
      matchingResults,
      totalPages,
      currentPage: page,
      pageSize: limit,
      returnedResults: result.length,
    },
    data: result,
  })
}



const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id).select('-postedBy ');


  let isApplied = job.candidateList?.some(
    (i) => i.user?.toString() == req.userID?._id?.toString(),
  );

  const ApplicationOfThisUser = job.candidateList?.find(i => i.user?.toString() === req.userID?._id?.toString())

  const {
    _id,
    title,
    deadlineDate,
    field,
    salary,
    workLocation,
    position,
    numberApplicants,
    description,
    createdAt,
    updatedAt,
  } = job;

  const data = {
    _id,
    title,
    deadlineDate,
    field,
    salary,
    workLocation,
    position,
    numberApplicants,
    description,
    createdAt,
    updatedAt,
    ApplicationOfThisUser,
    isApplied,
  };

  if (job) {
    res.json(data);
  } else {
    res.status(404);
    throw new Error('Job Not Found');
  }
};


const createNewJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user._id,
    status: 'opened',
  });
  res.status(201).json({
    status: 'success',
    message: 'Your job has been created.',
    data: job,
  });
  //ERROR
};
const updateCurrentJob = async (req, res) => {
  //Kiem tra postedBy === current user id
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select('-postedBy');
  if (job) {
    return res.status(200).json({
      status: 'success',
      message: 'Your job has been updated',
      data: job,
    });
  } else {
    //ERROR
  }
};

const applyJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  //Truong hop da apply job!!!
  if (job) {

    job.candidateList.push({
      ...req.body,
      status: 'awaiting',
      name: req.user.name,
      user: req.user._id,
    });
    await job.save();
    res.status(201).json({
      status: 'success',
      message: 'Your CV has been applied',
    });
  } else {
    res.status(404);
    throw new Error('Job Not Found');
  }
};

const getCandidateList = async (req, res) => {
  const job = await Job.findById(req.params.id).select('-status -postedBy');

  if (!job) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find job with provided id',
    });
  }

  res.status(201).json({
    status: 'success',
    data: job.candidateList || [],
  });
};
const handleApplication = async (req, res) => {
  const job = await Job.findById(req.params.id).select('-status -postedBy');
  const indexOfCandidate = job.candidateList.findIndex(
    (e) => e._id.toString() === req.params.index,
  );
  job.candidateList[indexOfCandidate].status = req.body.status;
  await job.save();
  res.status(201).json({
    status: 'success',
  });
};
const getJobWithFilter = async (req, res) => {
  const { title, position, field, sort } = req.query;

  try {
    const searchConditions = {};

    // Add conditions for each field if they exist in the query parameters
    //LOOP for query
    if (title) {
      searchConditions.title = { $regex: title, $options: 'i' };
    }
    if (position) {
      searchConditions.position = { $regex: position, $options: 'i' };
    }
    if (field) {
      searchConditions.field = { $regex: field, $options: 'i' };
    }
    if (sort) {
      if (sort === 'new') {
        const results = await Job.find(searchConditions)
          .select('-status -postedBy -candidateList ')
          .sort({ createdAt: -1 });
        return res.json(results);
      } else if (sort === 'most-expired') {
        const results = await Job.find(searchConditions)
          .select('-status -postedBy -candidateList ')
          .sort({ deadlineDate: -1 });
        return res.json(results);
      }
    } else {
      const results = await Job.find(searchConditions).select(
        '-status -postedBy ',
      );
      res.json(results);
    }
    // Query the database using the search conditions
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getPostedJobsByCurrentUser = async (req, res) => {
  const { page, skip = 0, limit = 10 } = req.query;

  const currentUserId = req.user._id;
  const matchingResults = await Job.countDocuments({
    postedBy: currentUserId,
  });
  const totalPages = Math.ceil(matchingResults / limit);

  const jobs = await Job.find({
    postedBy: currentUserId,
  })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: 'success',
    pagination: {
      matchingResults,
      returnedResults: jobs.length,
      totalPages,
      currentPage: +page,
      pageSize: limit,
    },
    data: jobs,
  });
};
const removeCVFromAppliedJob = async (req, res) => {

  const idUser = req.user?._id
  const { id } = req.params
  console.log('req.user?._id :', req.user?._id)
  const AfterRemoving = await Job.findByIdAndUpdate(
    id,
    { "$pull": { 'candidateList': { 'user': idUser } } },
    { new: true }
  );
  res.status(201).json({
    status: 'success',
    AfterRemoving,
  });
}








const jobController = {
  getJobList,
  createNewJob,
  updateCurrentJob,
  getJobById,
  applyJobById,
  getCandidateList,
  handleApplication,
  getJobWithFilter,
  getAppliedJobsByUserId,
  getPostedJobsByCurrentUser,
  removeCVFromAppliedJob,
};
export default jobController;
