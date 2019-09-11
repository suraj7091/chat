var express = require('express');
var router = express.Router();

// 
var passport = require('passport');
var User = require('../models/user');
var Oldchat=require('../apps/chat/models/oldchat');

// GET : http://name/router/
router.get('/', function(req, res) {
    res.render('register', { });
});

// POST : http://name/router/
router.post('/', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
        return res.render("/register", {info: "Sorry. That username already exists. Try again."})
    }
     
    id = req.body.username;
    var chatInstance = new Oldchat({
      _id: id,
    });
    chatInstance.save();    
    passport.authenticate('local')(req, res, function () {
        res.redirect('/chat');
    });
    });
});


module.exports=router;