var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OldchatSchema = new Schema({
    _id:String,
    },
    {
        strict: false,
    }
    

);
module.exports = mongoose.model('Oldchat',OldchatSchema);