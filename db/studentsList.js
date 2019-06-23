import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StudentsListSchema = new Schema({
    name: {
        type:String,
        required:[true,"id is required"]
    },
})

const StudentsList = mongoose.model('studentsList',StudentsListSchema);
module.exports = StudentsList;