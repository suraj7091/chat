var mongoose = require('mongoose');
var Schema = mongoose.Schema;
           
var chatSchema = new Schema({
    _id:String,
    users:[],
    message:[{
            sender:String,
            content:String,
            created:{
                type: Date,
                default : Date.now
            }
        }]
    },{
        timestamps: true
    }
);


module.exports = mongoose.model('Chat', chatSchema);
