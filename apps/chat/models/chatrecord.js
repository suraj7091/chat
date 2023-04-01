var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    _id: String,
    users: [],
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    seen_status:{
        type:Number,
        default:0
    }
},
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Chat', chatSchema);
