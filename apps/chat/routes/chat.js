var express = require('express');
var session = require('express-session');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var path = require('path');
var uniqid = require('uniqid');
var user;
var fs = require('fs');
var fileName = path.join(__dirname, 'alluser.json');
allusers = {};
groupid = {};
var id;
// Initializations
var current_app_location = path.join(__dirname, '..');
// DB Initializations
var User = require('../../../models/user');
var Chat = require(current_app_location + '/models/chatrecord');
var Oldchat = require(current_app_location + '/models/oldchat');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.user) {
    User.find({}).exec(function (err, items) {
      if (err) {
        console.log("Error:", err);
      } else {
        Oldchat.findOne({ '_id': req.user.username }).exec(function (err, oldchat) {
          if (err) {
            console.log(err);
          }
          else {


            oldchat = JSON.stringify(oldchat);
            oldchat = JSON.parse(oldchat);
            //console.log(oldchat);
            res.render('chat_index', {
              title: 'message',
              user: req.user,
              username: req.user.username,
              items: items,
              oldchat: oldchat,
              allusers:allusers
            });
          }
        });
      }
      session.allusers = allusers;
      user = req.user.username;
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {

  if (req.user) {
    // Make sure user exists
    User.findOne({ 'username': req.query.id}).exec(function (err, item) {
      if (err) {
        return next(new Error('Could not load content!'));
      }
      else {
        // Check if group with two user exist
        Chat.findOne({ $or: [{ users: [req.user.username, item.username] }, { users: [item.username, req.user.username] }] }).exec(function (err, userlist) {
          user1 = req.user.username;
          user2 = item.username;
          requser = user1 + user2;
          if (err) {
            return next(new Error('Could not found user'));
          }
          else if (userlist != null) {
            //load old message
            messages = userlist.message;
            res.json({ 'messages': messages });
            id = userlist.id;
            groupid[requser] = groupid[requser] || [];
            groupid[requser] = id;
            //setting oldchat as zero
            Oldchat.findOne({ _id: req.user.username }, function (err, p) {
              if (p == null) {
                console.log("not found");
              } else {
                a = JSON.stringify(p);
                a = JSON.parse(a);
                //console.log("yha se phle");
                if (a[item.username] != null&&a[item.username]!=0) {
                 
                  var count = 0;
                  p.set({ [item.username]: count });
                }
                p.save(function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('user offline Saved Succesfully');
                  }
                });
              }
            });

          }
          else {
            users = [req.user.username, item.username];
            id = uniqid();
            var chatInstance = new Chat({
              users: users,
              _id: id
            });
            chatInstance.save();
            groupid[requser] = groupid[requser] || [];
            groupid[requser] = id;
          }
        });
      }
    });
  }
  else {
    res.redirect('/login');
  }
});
io.on("connection", function (client) {
  console.log("Client connected...");
  client.on("join", function (socketid, requser) {
    // insertin into alluser array for new connection
    allusers[requser] = allusers[requser] || [];
    allusers[requser] = socketid;
  });
  //on message check for user socket in array allusers
  client.on("messages", function (data, from, to) {
    var socketid;
    socketid = allusers[to];
    client.broadcast.to(socketid).emit("thread", data, from);
    client.emit("thread", data, from);
    Chat.findById(groupid[from + to], function (err, p) {
      if (!p) {
        console.log("not live");
      } else {
        var message = { sender: from, content: data };
        p.message.push(message);
        p.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Message Saved Succesfully');
          }
        });
      }
    })
    if (allusers[to] == null) {
      // setting value inside oldchat
      Oldchat.findOne({ _id: to }, function (err, p) {
        if (p == null) {
          console.log(to);
          console.log("not found");
        } else {

          a = JSON.stringify(p);
          a = JSON.parse(a);
          if (a[from] == null) {
            count = 0;
            count++;
            p.set({ [from]: +count });
          }
          else {
            var count = a[from];
            p.set({ [from]: ++count });
          }
          p.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('user offline Saved Succesfully');
            }
          });
        }
      });
    }
  });
  client.on('typecheck', function (msg, to, from) {
    var socketid
    socketid = allusers[to];
    client.broadcast.to(socketid).emit("type", msg, from);
  });
});
server.listen(7777);
module.exports = router;
