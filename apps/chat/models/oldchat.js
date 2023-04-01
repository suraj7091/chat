var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OldchatSchema = new Schema({
    _id:String,
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
    offline_count:{
        type:Number,
        default:0
    },
    seen_status:{
        type:Number,
        default:0
    }
    },
    {
        strict: false,
    }
    

);
module.exports = mongoose.model('Oldchat',OldchatSchema);