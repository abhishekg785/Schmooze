// var channelName = "<%= channelName %>",
var channelName = $('#channelName').val(),
    sendMessage = $('#sendMessage'),
    messageText = $('#messageText'),
    chatDisplay = $('#chatDisplay'),
    usersDisplay = $('#usersDisplay'),
    channelList = $('#channelList'),
    channelCount = $('#channelCount');

console.log('CHANNEL NAME IS' + channelName);
console.log('IN THE SOCKET FUNCTIONS' + channelName);
var ChannelFunctions = {
  socketConnect : function(channelName){
    return io('localhost:3000', {
      query : 'channelName=' + channelName
    });
  },

  sendMessage : function(){
    var messageText = $('#messageText').val();
    if(messageText == ''){
      alert('Message Field is required!');
    }
    else{
      socket.emit('new channel message', {'messageText' : messageText});
      $('#messageText').val('');
    }
  }
}

var socket = ChannelFunctions.socketConnect(channelName);

sendMessage.on('click', function(){
  ChannelFunctions.sendMessage();
});

messageText.on('keypress', function(e){
  if(e.keyCode == 13){
    ChannelFunctions.sendMessage();
  }
});

socket.on('new channel message', function(data){
  var sender = data.sender,
      messageText = data.messageText,
      // item = sender + ':' + messageText + '<br/>';
      item = "<li><span class = 'uname'>"+ sender +"</span> : "+ messageText +"</li>";
  chatDisplay.append(item);
});

socket.on('channel user update', function(data){
  usersDisplay.empty();
  var users = data.users;
  users.forEach(function(user){
    var item = "<span>" + user + "</span>";
    usersDisplay.append(item);
  });
});

socket.on('set channel messages' , function(data){
  chatDisplay.empty();
  var messages = data.messages;
  messages.forEach(function(message, i){
    var messageText = message.messageText,
        date = message.date,
        username = message.username,
        dateStringCurr = date.split("T")[0];
    if(i > 0){
      dateStringPrev = messages[i-1].date.split("T")[0];
      if(dateStringCurr != dateStringPrev){
        var logLastDate = messages[i-1].date;
        chatDisplay.append("<span style = 'color:orange'><li>------------------------Above session logs from " + logLastDate +"-------------------</li></span>");
      }
    }
    var item = "<li><span class = 'uname'>"+ username +"</span> : "+ messageText +"</li>";
    chatDisplay.append(item);
  });
  if(messages.length > 0){
    var logLastDate = messages[messages.length - 1].date;
    chatDisplay.append("<span style = 'color:orange'><li>------------------------Above session logs from " + logLastDate +"-------------------</li></span>");
  }
});

socket.on('set channels', function(data){
  channelList.empty();
  var channels = data.channels;
  channelCount.val(channels.length);
  channelList.append("<span style = 'color:orange'><a href = '/chat'>Global Chat</a></span>");
  channels.forEach(function(channel){
    if(!(channel.channelName == channelName)){
      var channelNameVal = channel.channelName;
      var item = "<span><a href = '"+ channelNameVal +"'>"+ channelNameVal +"</span>";
      channelList.append(item);
    }
  });
});
