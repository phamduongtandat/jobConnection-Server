import bcrypt from 'bcryptjs';
import { isAfter } from 'date-fns';
import jwt from 'jsonwebtoken';
import { sendResetPasswordToken } from '../emails/index.js';
import { User } from '../models/user.model.js';

export const hashPassword = async (password) => await bcrypt.hash(password, 10);

const resAuthTokenByCookie = (req, res, user) => {
  const authToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  res.cookie('jwt', authToken, {
    httpOnly: true,
    secure: req.secure,
  });
};

const registerUser = async (req, res) => {
  const body = req.body;

  const hashedPassword = await hashPassword(body.password);
  body.password = hashedPassword;

  const newUser = await User.create(body);

  resAuthTokenByCookie(req, res, newUser);

  res.status(201).json({
    status: 'success',
    message: 'Your account has been created',
    data: newUser,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid email or password',
    });
  }

  resAuthTokenByCookie(req, res, user);
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: user,
  });
};

const signOut = async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
    message: 'You has been signed out',
  });
};

const createResetPasswordToken = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided email',
    });
  }

  const resetPasswordToken = jwt.sign(
    {
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  sendResetPasswordToken({
    token: resetPasswordToken,
    email,
    name: user.name,
  });

  res.status(200).json({
    status: 'success',
    message: 'Please check your mailbox to reset the password',
  });
};

const resetPasswordWithToken = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = await hashPassword(newPassword);

  const token = req.params.token;

  const { email, iat } = jwt.verify(token, process.env.JWT_SECRET);

  // check if the token is expired'
  const user = await User.findOne({ email });
  if (
    user.passwordChangedAt &&
    isAfter(new Date(user.passwordChangedAt), new Date(iat * 1000))
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'The token is expired',
    });
  }

  await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, passwordChangedAt: new Date() },
  );

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find user with provided email',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Your password has been reset',
  });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // make sure old password is correct

  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    req.user.password,
  );

  if (!isCorrectPassword) {
    return res.status(400).json({
      status: 'fail',
      message: 'Your password is not correct',
    });
  }

  const hashedPassword = await hashPassword(newPassword);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true },
  );

  res.status(200).json({
    status: 'success',
    message: 'Your password has been updated. Please log in again',
  });
};

const updateCurrentUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Your account has been updated',
    data: user,
  });
};

const getCurrentLoggedInUser = async (req, res) => {
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  res.status(200).json({
    status: 'success',
    data: user,
  });
};

const authController = {
  registerUser,
  signIn,
  signOut,
  getCurrentLoggedInUser,
  updateCurrentUser,
  updatePassword,
  createResetPasswordToken,
  resetPasswordWithToken,
};

export default authController;
