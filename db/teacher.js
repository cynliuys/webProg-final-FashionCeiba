import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    id: {
        type:String,
        required:[true,"id is required"]
    },
    pic: {
        type:String,
        required:[true,"pic is required"]
    },
    filename: {
        type:String,
        required:[true,"filename is required"]
    },
    page: {
        type:String,
        required:[true, "page is required"]
    }
})

const Teacher = mongoose.model('teacher',TeacherSchema);
module.exports = Teacher;