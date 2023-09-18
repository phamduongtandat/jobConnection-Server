import express from 'express';
import adminController from '../controllers/admin.controller.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';
import parseReqQuery from '../middleware/parseReqQuery.js';

const adminRouter = express.Router();
//router for only admin
adminRouter.use(requireLogin());
adminRouter.use(requireRole('admin'));

//routes

//get all jobs
adminRouter.get('/jobs', parseReqQuery(), adminController.getJobList);
//get job by id
adminRouter.get('/jobs/:id', adminController.getJobById);
//remove job
adminRouter.put('/jobs/:id', adminController.removeJobById);

export default adminRouter;
