var express = require('express');
var router = express.Router();
var session = require('express-session');

var User = require('../models/user');
// GET : /logout
router.get('/', function (req, res) {
  User.findById(req.user.id, function(err, p) {
    if(!err){
      p.last_logout = new Date();

      p.save(function(err) {
        if(err){
          console.log("Error");
          allusers[req.user.username]=null;
          req.session.destroy();
          res.redirect('/');
          req.logout();
        }else{
          console.log("No Error");
          allusers[req.user.username]=null;
          req.session.destroy();
          res.redirect('/');
          req.logout();
        }
      });
    }
  });
});

module.exports = router;