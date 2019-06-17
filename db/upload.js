import moongoose from 'mongoose';

const Schema = moongoose.Schema;

const uploadSchema =  new Schema({
    id:{
        type:String,
        required:[true,"The id is required"]
    },
    filename: {
        type: String,
        required: [true, 'The filename is necessary']
    },
    mimetype: {
        type: String,
        required: [true, 'The mimetype is necessary']
    },
    encoding: {
        type: String,
    },
    path : {
        type: String,
    }
});

export default moongoose.model('uploads', uploadSchema);