import mongoose from 'mongoose';
import User from './user';
import Uploadpdf from './uploadpdf';
import Teacher from './teacher';
import StudentsList from './studentsList';
import Todo from './todo';
import Chat from './chat'

mongoose.Promise = global.Promise;

export const startDB = ({ URL }) =>{
  mongoose.connect(URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB...", err));
  
}
  
export const models = {
    User,
    Uploadpdf,
    Teacher,
    StudentsList,
    Todo,
    Chat
}