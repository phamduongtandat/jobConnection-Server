import express from 'express';
import adminRouter from './admin.router.js';
import authRouter from './auth.router.js';
import fieldRouter from './field.router.js';
import jobRouter from './job.router.js';
import messageRouter from './message.router.js';
import searchRouter from './search.router.js';
import userRouter from './user.router.js';

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.status(200).send('sss');
});

indexRouter.use('/api/v1/auth', authRouter);
indexRouter.use('/api/v1/users', userRouter);
indexRouter.use('/api/v1/fields', fieldRouter);
indexRouter.use('/api/v1/search', searchRouter);
indexRouter.use('/api/v1/jobs', jobRouter);
indexRouter.use('/api/v1/admin', adminRouter);
indexRouter.use('/api/v1/messages', messageRouter);

export default indexRouter;
