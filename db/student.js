import mongoose from 'mongoose';
const Schema = mongoose.Schema;


function newStudentSchema(student){
    const StudentSchema = new Schema({
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
        },
        student: {
            type:String,
            required:[true, "page is required"]
        }
    })

    const StudentFinal = mongoose.model(student, StudentSchema);
    return StudentFinal;
}


export { newStudentSchema};