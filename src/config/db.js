import mongoose from 'mongoose';

//connect DB
const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Mongodb connected');
  });
};

export { connectDB };
