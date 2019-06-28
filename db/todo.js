import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    id: {
        type:String,
        required:[true,"id is required"]
    },
    text: {
        type:String,
        required:[true,"text is required"]
    },
    time: {
        type:String,
        required:[true,"time is required"]
    },
})

const Todos = mongoose.model('todos',TodoSchema);
module.exports = Todos;