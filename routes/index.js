var express = require('express');
var router = express.Router();

// Models
var User =  require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.render('index', {
      title: 'Chat',
      user: req.user
    });
  }else{
    res.redirect('/login');
  }
});

// GET PROFILE PIC OF ANY USER
router.get('/img/user/:username', function(req, res){
  if(req.user){
    User.findOne({'username': req.params.username}, function(err, item){
      if(!err){
        if (typeof item.profile_pic.data !== 'undefined'){
          var img = new Buffer(item.profile_pic.data, 'base64');

          res.writeHead(200, {
            'Content-Type': item.profile_pic.contentType,
            'Content-Length': img.length
          });
          res.end(img);
        }else{
          res.status(404);
        }
      }else{
        res.status(404);
      }
    });
  }else{
    res.redirect('/login');
  }
});


module.exports = router;
