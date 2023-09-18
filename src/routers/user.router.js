import express from 'express';
import userController from '../controllers/user.controller.js';
import parseReqQuery from '../middleware/parseReqQuery.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';
import validateReqBody from '../middleware/validateReqBody.js';
import cvSchema from './../validation/cv.schema.js';
import {
  createNewAdminSchema,
  updateUserByIdSchema,
  updateUserStatusSchema,
} from '../validation/user.schema.js';
import requireTypeAccount from '../middleware/requireTypeAccount.js';

const userRouter = express.Router();

// admin only router
userRouter.use(requireLogin());


//       _____ CVs _____ 

userRouter.post(
  '/CVs/:id',
  requireTypeAccount('personal'),
  validateReqBody(cvSchema),
  userController.createCVsManagement,
);

userRouter.put(
  '/CVs/:id',
  requireTypeAccount('personal'),
  userController.deleteCV,
);

userRouter.get('/CVs/:id', userController.getCVs);


userRouter.use(requireRole('admin'));

// routes
userRouter.get('/', parseReqQuery(), userController.getUsers);
userRouter.post(
  '/',
  validateReqBody(createNewAdminSchema),
  userController.createNewAdmin,
);
userRouter.get('/:id', userController.getUserById);
userRouter.put(
  '/:id',
  validateReqBody(updateUserByIdSchema),
  userController.updateUser,
);
userRouter.put(
  '/:id/user-status',
  validateReqBody(updateUserStatusSchema),
  userController.updateUserStatus,
);



export default userRouter;
