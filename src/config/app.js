import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import globalErrorHandler from '../middleware/globalErrorHandler.js';
import indexRouter from '../routers/index.js';

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

app.use(indexRouter);
app.use(globalErrorHandler);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `${req.baseUrl} does not exist. Double check the route & method types.`,
  });
});

export { app };
