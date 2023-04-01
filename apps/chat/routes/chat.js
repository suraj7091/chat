var express = require("express");
var session = require("express-session");
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var path = require("path");
var uniqid = require("uniqid");
allusers = {};
var current_app_location = path.join(__dirname, "..");
var User = require("../../../models/user");
var Chat = require(current_app_location + "/models/chatrecord");
var Oldchat = require(current_app_location + "/models/oldchat");

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.user) {
    res.redirect("/login");
    return
  }
  Oldchat.find({ $or: [{ "receiver": req.user.username }, { "sender": req.user.username }] })
    .sort({ created: -1 }).exec(function (err, oldchat) {
      if (err) {
        console.log("Following error comes for get Old chat dashboard" + err);
      } else {
        res.render("chat_index", {
          title: "message",
          curr_user: req.user,
          username: req.user.username,
          oldchats: JSON.parse(JSON.stringify(oldchat)),
        });
      }
    });
});

router.post("/", function (req, res, next) {
  if (!req.user) {
    res.redirect("/login");
  }
  // Make sure user exists
  User.findOne({ username: req.query.id }).exec(function (err, item) {
    if (err) {
      return next(new Error("Could not Found Chat for selected User!"));
    }
    // Check if group with two user exist
    Chat.find({
      $or: [{ users: [req.user.username, item.username] }, { users: [item.username, req.user.username] },],
    }).exec(function (err, messages) {
      if (err) {
        return next(new Error("Could not found user"));
      } else if (messages != null) {
        res.json({ 'messages': messages });
        Oldchat.findOne({ $or: [{ users: [req.user.username, item.username] }, { users: [item.username, req.user.username] },], })
          .exec(function (err, old_chat) {
            if (err !== null) {
              console.log("following error occured while finding old chat" + err);
              return
            } if (old_chat != null) {
              if(old_chat.receiver==req.user.username){
              old_chat.set({ 'offline_count': 0, seen_status: 2 });
              }
              old_chat.save(function (err) {
                if (err) {
                  console.log("following error occured while updating old chat" + err);
                } else {
                  console.log("Old chat updated with 0 count for user" + req.user.username);
                }
              });
            }
          });
      } else {
        res.json({})
      }
    });
  });
});
io.on("connection", function (client) {
  console.log("Client connected...");
  client.on("join", function (socketid, requser) {
    // insertin into alluser array for new connection
    User.findOne({ username: requser }).exec(function (err, curr_user) {
      if (err) {
        return next(new Error("Could not Found Chat for selected User!"));
      }
      curr_user.set({ socket_id: socketid })
      curr_user.save(function (err) {
        if (err) {
          console.log("following error occured while updating socket for user " + err);
        } else {
          console.log("Socket id updated for user" + requser);
        }
      });
    })
  });
  //on message check for user socket in array allusers
  client.on("messages", function (data, from, to) {
    User.findOne({ username: to }).exec(function (err, receiver) {
      if (err) {
        console.log("Could not Found selected User!" + to)
        return next(new Error("Could not Found selected User!" + to));
      }
      client.broadcast.to(receiver.socket_id).emit("thread", data, from);
      client.emit("thread", data, from);
      let receiver_json =JSON.parse(JSON.stringify(receiver))
      let user_online=true;
      if (!receiver_json.socket_id) {
        user_online=false
      }
        Oldchat.findOne({ $or: [{ users: [to,from] }, { users: [from, to] },], })
          .exec(function (err, old_chat) {
            if (err !== null) {
              console.log("following error occured while finding old chat" + err);
              return
            } if (old_chat != null) {
              old_chat.set({
                'offline_count': user_online?0:(old_chat.offline_count || 0) + 1, 'seen_status': user_online?2:0, 'sender': from,
                'receiver': to, created: Date.now(),message:data
              });
              old_chat.save(function (err) {
                if (err) {
                  console.log("following error occured while updating old chat" + err);
                } else {
                  console.log("Old chat updated with new count count for user" + from + " " + to);
                }
              });
            } else {
              let old_chat = new Oldchat({
                _id:uniqid(),
                'offline_count': user_online?0:1, 'seen_status': user_online?2:0, 'sender': from,
                'receiver': to, created: Date.now(),message:data,users: [from, to]
              })
              old_chat.save(function (err) {
                if (err) {
                  console.log("following error occured while creating old chat" + err);
                } else {
                  console.log("Old chat creatd for user" + from + " " + to);
                }
              })
            }
          });
      let chatInstance = new Chat({
        _id:uniqid(),
        users: [from, to],
        _id: uniqid(),
        receiver: to,
        sender: from,
        message: data
      })
      chatInstance.save(function (err) {
        if (err) {
          console.log("following error occured while creating  chat" + err);
        } else {
          console.log("Chat creatd for user" + from+" "+to);
        }
      })
    })
  });
  client.on("typecheck", function (msg, to, from) {
    User.findOne({ username: to }).exec(function (err, curr_user) {
      if (err) {
        console.log("Could not Found selected User!" + to)
        return next(new Error("Could not Found selected User!" + to));
      }
      client.broadcast.to(curr_user.socket_id).emit("type", msg, from);
    })
  });
});
server.listen(7777);
module.exports = router;
