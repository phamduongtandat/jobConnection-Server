// config env
import 'dotenv/config';
import { app } from './config/app.js';
import { connectDB } from './config/db.js';
import './config/socketio.js';

// connect to db
connectDB();

app.listen(8080, () => {
  console.log('App running on port 8080');
});
