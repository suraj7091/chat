var express = require('express');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);

var path = require('path');
allusers = {};
groupid = {};
// Initializations

// DB Initializations
var User = require('../../../models/user');

function Matched(value, pattern) {

    if (pattern.length > value.length) {
        return false
    }
    value = value.toLowerCase()
    pattern = pattern.toLowerCase()

    threshold = 0.7
    var i, j;
    valLen = value.length + 1
    patLen = pattern.length + 1
    var diff = new Array(valLen)
    // var arr = new Array(d1);
    for (i = 0; i < valLen; i++) {
        diff[i] = new Array(valLen);
    }

    for (i = 0; i < valLen; i++) {
        diff[i][0] = i
    }
    for (j = 0; j < patLen; j++) {
        diff[0][j] = j
    }
    var min
    for (i = 1; i < valLen; i++) {
        for (j = 1; j < patLen; j++) {
            if (value[i - 1] == pattern[j - 1]) {
                diff[i][j] = diff[i - 1][j - 1]
            } else {
                min = diff[i][j - 1];
                if (diff[i - 1][j - 1] < diff[i][j - 1]) {
                    min = diff[i - 1][j - 1]
                }
                if (min > diff[i - 1][j]) {
                    min = diff[i - 1][j]
                }
                diff[i][j] = 1 + min
            }
        }
    }

    if (((value.length - diff[valLen - 1][patLen - 1]) / (pattern.length)) >= threshold) {
        return true
    }

    return false
}

function findMatch(userList, search) {
    var finalList = []

    for (let i = 0; i < userList.length; i++) {
        if (Matched(userList[i].username, search)) {
            finalList.push(userList[i])
            continue
        }
    }

    return finalList
}




/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.user) {
        // Make sure user exists
        const search =req.query.search;
        User.find({username:{$ne:req.user.username}}).exec(function (err, item) {
            if (err) {
                return next(new Error('Could not load content!'));
            }
            else {
                // console.log(findMatch(item, search))
                const userList=findMatch(item,search)
                res.render('userSearch', {
                    title: 'message',
                    user: req.user,
                    items:userList
                  });
            }
        });
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;
