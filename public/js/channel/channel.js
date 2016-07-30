var channelName = $('#channelName').val(),
    sendMessage = $('#sendMessage'),
    messageText = $('#messageText'),
    chatDisplay = $('#chatDisplay'),
    usersDisplay = $('#usersDisplay'),
    channelList = $('#channelList'),
    channelCount = $('#channelCount'),
    loggedUser = $('#loggedUser').val(),
    botName = 'bot@ARON';

/*
*  color schemes
*  aaronBot : #2c3e50
*  loggedUserMessage : #8e44ad
*  usermessage : #fff
*  logText : #c0392b
*  @user Noti : #e74c3c
*/
var colorSchemes = {
  aronBot : '#2c3e50',
  loggedUserMessage : '#8e44ad',
  usermessage : '#fff',
  logText : '#c0392b',
  userNoti : '#e74c3c'
};

var ChannelFunctions = {
  sendMessage : function(){
    var messageText = $('#messageText').val();
    if(messageText == ''){
      alert('Message Field is required!');
    }
    else{
      socket.emit('new channel message', {'messageText' : messageText}, function(data){
        if(data && data.length > 0){
          alert(data);
        }
      });
      $('#messageText').val('');
    }
  },

  scrollDivToHeight : function(divName){
    $("#" + divName).animate({ scrollTop: $('#' + divName)[0].scrollHeight }, 1000);
  }
}

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
      messageText = data.messageText;
  sender != loggedUser ? item = "<li><span class = 'uname'>"+ sender +"</span> : "+ messageText +"</li>" : item = "<li class = 'loggedUser'><span class = 'uname'>"+ sender +"</span> : "+ messageText +"</li>";
  chatDisplay.append(item);
  ChannelFunctions.scrollDivToHeight('chatDisplay');
});

socket.on('channel user update', function(data){
  usersDisplay.empty();
  var users = data.users;
  users.forEach(function(user){
    if(user == loggedUser){
      var item = "<span class = 'onlineLoggedUser' onclick = 'privateMessageHandlerFunctions.showMessageViewToSendMessages("+ '"' + user + '"' + ")'>" + user + "</span>";
    }
    else{
      var item = "<span onclick = 'privateMessageHandlerFunctions.showMessageViewToSendMessages("+ '"' + user + '"' + ")'>" + user + "</span>";
    }
    usersDisplay.append(item);
  });
});

socket.on('set channel messages', function(data){
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
        chatDisplay.append("<span class = 'chatLogs'><li>----Above session logs from " + logLastDate +"----</li></span>");
      }
    }
    if(username == loggedUser){
      var item = "<li class = 'loggedUser'><span class = 'uname'>"+ username +"</span> : "+ messageText +"</li>";
    }
    else{
      var item = username != botName ? "<li><span class = 'uname'>"+ username +"</span> : "+ messageText +"</li>" : "<li class = 'botClass' style = 'font-size:11px'><span class = 'uname'>"+ username +"</span> : "+ messageText +"</li>";
    }
    chatDisplay.append(item);
  });
  if(messages.length > 0){
    var logLastDate = messages[messages.length - 1].date;
    chatDisplay.append("<span class = 'chatLogs'><li>----Above session logs from " + logLastDate +"----</li></span>");
  }
  ChannelFunctions.scrollDivToHeight('chatDisplay');
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

socket.on('join channel command', function(data){
  if(data.channelName){
    window.location = '/channel/' + data.channelName;
  }
  else{
    alert('No such channel Exists !');
  }
});

socket.on('new private message', function(data){
  messageSpan.css('color', 'red');
  privateMessageHandlerFunctions.pushPrivateMessage(data);
  privateMessageHandlerFunctions.realTimeMessageView(data);
});

socket.on('terminate', function(data){
  location.reload();
});

socket.on('new log message', function(data){
  chatDisplay.append("<span class = 'chatLogs'><li>----" + data.logMessage +"----</li></span>");
  ChannelFunctions.scrollDivToHeight('chatDisplay');
});
