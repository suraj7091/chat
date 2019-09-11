var mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;
           
var User = new Schema({
  username:{
    type:String,
    required:true
  },
  password: String,
  profile_pic: { 
    data: Buffer,
    contentType: String
   },
  name : {
    type: String,
    required: false
  },
  email : {
    type: String,
    required: false
  },
  last_logout :{
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);