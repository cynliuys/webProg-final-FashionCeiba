import moongoose from 'mongoose';

const Schema = moongoose.Schema;

const uploadSchema =  new Schema({
    _id:{
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
});

export default moongoose.model('pdfs', uploadSchema);