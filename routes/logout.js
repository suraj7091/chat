var express = require('express');
var router = express.Router();
var session = require('express-session');

var User = require('../models/user');
// GET : /logout
router.get('/', function (req, res) {
  if(!req.user){
    res.redirect('/login');
  }
    allusers[req.user.username] = null;
    req.session.destroy();
    res.redirect('/');
    req.logout();
});

module.exports = router;