  var onlineUserArea = $('#onlineUserArea'),
      channelArea = $('#channelArea'),
      chatArea = $('#chatArea'),
      sendMessage = $('#sendMessage'),
      messageText = $('#messageText'),
      chatHeading = $('#chatHeading'),
      chatDisplay = $('#chatDisplay'),
      usersDisplay = $('#usersDisplay'),
      messageSpan = $('#messageSpan');

  var GlobalChatFunctions = {
    sendMessage : function(){
      var messageText = $('#messageText').val();
      if(messageText == ''){
        alert('Message field is required');
      }
      else{
        socket.emit('new group message', {'messageText':messageText}, function(data){
          if(data){
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

  socket.on('update users', function(data){
    usersDisplay.empty();
    users = data.users;
    for(var i = 0 ; i < users.length; i++){
      var list = "<span onClick = 'privateMessageHandlerFunctions.showMessageViewToSendMessages("+ '"' + users[i] + '"' + ")'>" + users[i] + "</span>";
      usersDisplay.append(list);
    }
  });

  sendMessage.on('click', function(e){
    GlobalChatFunctions.sendMessage();
  });

  messageText.on('keydown', function(e){
    if(e.keyCode == 13){
      GlobalChatFunctions.sendMessage();
    }
  });

  socket.on('new group message', function(data){
    var sender = data.sender,
        messageText = data.messageText;
        item = "<li><span class = 'uname'>"+ sender +"</span> : "+ messageText +"</li>";
    chatDisplay.append(item);
    GlobalChatFunctions.scrollDivToHeight('chatDisplay');
  });

  socket.on('set group message', function(data){
    chatDisplay.empty();
    var messages = data.messages;
    messages.forEach(function(message, i){
      var messageText = message.messageText,
          date = message.date,
          username = message.username,
          dateStringCurr = date.split("T")[0];
      if(i>0){
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
    GlobalChatFunctions.scrollDivToHeight('chatDisplay');
  });

  socket.on('terminate', function(data){
    location.reload();
  });

  socket.on('join channel command', function(data){
    if(data.channelName){
      window.location = '/channel/' + data.channelName;
    }
    else{
      alert('No such channel Exists');
    }
  });

  socket.on('new private message', function(data){
    /* show user noti for new messages */
    messageSpan.css('color', 'red');
    privateMessageHandlerFunctions.pushPrivateMessage(data);
    privateMessageHandlerFunctions.realTimeMessageView(data);
  });

  socket.on('new log message', function(data){
    chatDisplay.append("<span style = 'color:orange'><li>------------------------" + data.logMessage +"-------------------</li></span>");
    GlobalChatFunctions.scrollDivToHeight('chatDisplay');
  });
