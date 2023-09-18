import mongoose from 'mongoose'
import { sendNewUserCredentials } from '../emails/index.js';
import { CV } from '../models/cv.model.js';
import { User } from '../models/user.model.js';
import randomString from '../utils/randomString.js';
import { hashPassword } from './auth.controller.js';

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select(req.query.fields);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

const updateUser = async (req, res) => {
  const body = req.body;

  if (body.role === 'admin') {
    body.account_type = 'admin';
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

const updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user)
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided id',
    });

  if (user.role === 'admin' && status === 'blocked')
    return res.status(403).json({
      status: 'fail',
      message: 'You can not block admin user',
    });

  await User.findByIdAndUpdate(id, { status });

  res.status(200).json({
    status: 'success',
    message: 'The user has been blocked',
  });
};

const createNewAdmin = async (req, res) => {
  const { name, email, phone, role } = req.body;

  const randomPassword = randomString(48);
  const hashedPassword = await hashPassword(randomPassword);

  const user = await User.create({
    name,
    email,
    phone,
    role: 'admin',
    account_type: 'admin',
    password: hashedPassword,
  });

  sendNewUserCredentials({
    email,
    password: randomPassword,
    name,
  });

  res.status(201).json({
    status: 'success',
    message:
      'The account has been created. An email with credentials has been sent to user mailbox',
  });
};

const getUsers = async (req, res) => {
  const { fields, page, skip = 0, limit = 10, sort, filter = {} } = req.query;
  const matchingResults = await User.countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / limit);

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sort);

  res.status(200).json({
    status: 'success',
    pagination: {
      matchingResults,
      returnedResults: users.length,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
    data: users,
  });
};


//       _____ CVs _____ 
const createCVsManagement = async (req, res) => {
  const { name, file } = req.body;
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user)
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided id',
    });

  const CVstore = await CV.find({ user: new mongoose.Types.ObjectId(id) })



  if (CVstore?.length === 0) {

    const result = await CV.create({
      user: id,
      CVs: [{ name, file }]
    });
    return res.status(200).json({
      status: 'success',

      data: result,
    });
  }

  const result = await CV.updateOne({ user: new mongoose.Types.ObjectId(id) }, { $push: { CVs: { name, file } } }, { new: true })

  return res.status(200).json({
    status: 'success',
    data: result,
  });
}

const deleteCV = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const result = await CV.updateOne({ user: new mongoose.Types.ObjectId(id) }, { $pull: { CVs: { name } } }, { new: true })

  return res.status(200).json({
    status: 'success',
    data: result,
  });
}

const getCVs = async (req, res) => {

  let id = req.params.id

  if (id === 'undefined') {
    id = req.user._id.toString()
  }

  const result = await CV.findOne({ user: new mongoose.Types.ObjectId(id) }).select('CVs')

  return res.status(200).json({
    status: 'success',
    data: result,
  });


}

const userController = {
  getUsers,
  createNewAdmin,
  getUserById,
  updateUser,
  updateUserStatus,
  createCVsManagement,
  deleteCV,
  getCVs
};

export default userController;
