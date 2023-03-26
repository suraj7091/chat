var mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;
           
var User = new Schema({
  username : {
    type: String,
    required: true
  },
  password: String,
  profile_pic: { 
    data: Buffer,
    contentType: String
   },
  name : {
    type: String,
    required: true
  },
  last_login :{
    type: Date,
    required: false
  },
  gender :{
    type: String,
    required: true
  },
  dob :{
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);