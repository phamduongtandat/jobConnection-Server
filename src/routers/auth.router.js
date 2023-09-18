import express from 'express';
import authController from '../controllers/auth.controller.js';
import requireLogin from '../middleware/requireLogin.js';
import validateReqBody from '../middleware/validateReqBody.js';
import {
  createResetPasswordTokenSchema,
  registerUserSchema,
  resetPasswordWithTokenSchema,
  signInSchema,
  updateCurrentUserSchema,
  updatePasswordSchema,
} from '../validation/auth.schema.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateReqBody(registerUserSchema),
  authController.registerUser,
);

authRouter.post(
  '/sign-in',
  validateReqBody(signInSchema),
  authController.signIn,
);

authRouter.delete('/sign-out', authController.signOut);
authRouter.get(
  '/current-user',
  requireLogin(),
  authController.getCurrentLoggedInUser,
);

authRouter.put(
  '/current-user',
  requireLogin(),
  validateReqBody(updateCurrentUserSchema),
  authController.updateCurrentUser,
);

authRouter.put(
  '/update-password',
  requireLogin(),
  validateReqBody(updatePasswordSchema),
  authController.updatePassword,
);

authRouter.post(
  '/reset-password-token',
  validateReqBody(createResetPasswordTokenSchema),
  authController.createResetPasswordToken,
);

authRouter.put(
  '/reset-password/:token',
  validateReqBody(resetPasswordWithTokenSchema),
  authController.resetPasswordWithToken,
);

export default authRouter;
