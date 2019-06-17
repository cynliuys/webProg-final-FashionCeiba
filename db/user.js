import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    id: {
        type:String,
        required:[true,"id is required"]
    },
    email: {
        type:String,
        required:[true,"email is required"]
    },
    name: {
        type:String,
        required:[true,"name is required"]
    },
    pwd: {
        type:String,
        required:[true, "pwd is required"]
    }
})

const Users = mongoose.model('users',UsersSchema);
module.exports = Users;