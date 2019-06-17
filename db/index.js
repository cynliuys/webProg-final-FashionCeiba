import mongoose from 'mongoose';
import User from './user';
import Upload from './upload';
import Uploadmore from './uploadmore';
import Teacher from './teacher';

mongoose.Promise = global.Promise;

export const startDB = ({ URL }) => 
  mongoose.connect(URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB...", err));
  
export const models = {
    User,
    Upload,
    Uploadmore,
    Teacher
}