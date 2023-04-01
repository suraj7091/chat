var express = require('express');
var router = express.Router();
var User = require('../models/user');
// GET : /logout
router.get('/', function (req, res) {
  if (!req.user) {
    res.redirect('/login');
  }
  User.findOne({ username: req.user.username }).exec(function (err, curr_user) {
    if (err) {
      return next(new Error("Could not Found Chat for selected User!"));
    }
    curr_user.set({ socket_id: null })
    curr_user.save(function (err) {
      if (err) {
        console.log("following error occured while updating socket for user on logout" + err);
      } else {
        console.log("Socket id deleted for user");
      }
    });
  })
  req.session.destroy();
  res.redirect('/');
  req.logout();
});

module.exports = router;