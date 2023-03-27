var time;
var timeoutclient;
var type = false;
var socket;
//connecting client to server through socket
socket = io.connect("http://192.168.101.24:7777", { secure: true }); socket.on("connect", function (data) {
  socket.emit("join", socket.id, from);
});
socket.on("type", function (msg, sender) {
  console.log('typing');
  document.getElementById(sender + "2").innerHTML = msg;
  clearInterval(timeoutclient);
  timeoutclient = setTimeout(timeoutclientFunction, 5000);
});
function timeoutclientFunction() {
  var x = document.getElementsByClassName("chat");
  for (var j = 0; j < x.length; j++) {
    x[j].innerHTML = '';
  }
}
//on message from sender 
socket.on("thread", function (data, sender) {
  if (sender == from) {//if sender is same as user
    $("#chat-message").append('<li class="d-flex justify-content-between mb-4"><div class="chat-body white p-3 ml-2 z-depth-1" style="min-width:200px ;"> <div class="header"><strong class="primary-font">' + 'You' + '</strong><small class="pull-right text-muted"><i class="fa fa-clock-o"></i> just Now</small></div><hr class="w-100"/> <p class="mb-0">' + data + '</p </div> </li>');
    var elem = document.getElementById('chat-message');
    elem.scrollTop = elem.scrollHeight;
  }
  else {
    if (sender == to)//if user is chatting with sender
    {
      $("#chat-message").append('<li class="d-flex justify-content-between mb-4"><div class="chat-body  p-3 z-depth-1 " style="margin-left:70%;min-width:200px;background-color:lightgreen;"><div class="header"><strong class="primary-font">' + 'Other' + '</strong><small class="pull-right text-muted"><i class="fa fa-clock-o"></i> JustNow</small></div><hr class="w-100"/><p class="mb-0">' + data + '</p></div> </li>');
      var elem = document.getElementById('chat-message');
      elem.scrollTop = elem.scrollHeight;
    }
    else//if user is not chatting with user
    {
      var c = document.getElementById(sender + "3").innerHTML;
      document.getElementById(sender + "3").style.display = 'inline';
      document.getElementById(sender + "3").innerHTML = ++c;
    }
  }
});
// sends message to server, resets & prevents default form action
$("#messageform").submit(function () {
  var message = $("#exampleFormControlTextarea2.form-control.pl-2.my-0").val();
  if (message != '') {
    socket.emit("messages", message, from, to);
  }
  this.reset();
  return false;
});
//typing notification
$("#exampleFormControlTextarea2.form-control.pl-2.my-0").keypress(function () {
  msg = 'Typing...';
  if (type == false) {
    socket.emit('typecheck', msg, to, from);
    type = true;
    setTimeout(timeoutFunction, 3000);
    function timeoutFunction() {
      type = false;
    }
  }
});

