var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// -> /login
router.get('/', function (req, res, next) {
  if (req.user) {
    res.redirect('/chat');
  } else {
    res.render('login', { title: 'login' });
  }
});

// -> /login
router.post('/', passport.authenticate('local', { failureMessage: true , failureRedirect: '/login' }), (req,res) => {
  if (req.user) {
    User.findById(req.user.id, function (err, curr_user) {
      if (!err) {
        curr_user.last_login = new Date();
        curr_user.save(function (err) { });
      }
      else {
        console.log(err)
      }
    })
  }
  res.redirect('/chat');
})


module.exports = router;
