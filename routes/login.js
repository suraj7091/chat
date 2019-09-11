var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// -> /login
router.get('/', function(req, res, next) {
  if(req.user){
      res.redirect('/chat');
  }else{
    res.render('login', { title: 'login' });
  }
});

// -> /login
router.post('/',
  
  passport.authenticate('local', { successRedirect: '/chat',
                                   failureRedirect: '/login' }));


module.exports = router;
