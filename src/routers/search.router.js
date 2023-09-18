import express from 'express';
import searchController from '../controllers/search.controller.js';
import requireLogin from '../middleware/requireLogin.js';
import requireRole from '../middleware/requireRole.js';
const searchRouter = express.Router();

searchRouter.get('/jobs', searchController.searchJobs)
searchRouter.use(requireLogin());

searchRouter.get('/fields', requireRole('admin'), searchController.searchFields)

export default searchRouter;