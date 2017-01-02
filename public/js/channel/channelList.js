/*
*  author : abhishek goswami
*  abhishekg785@gmail.com
*
*  channelList.js
*/

var channelListHeading = $('#channelListHeading'),
    channelList = $('#channelList'),
    chatDisplay = $('#chatDisplay'),
    createChannelButton = $('#createChannelButton'),
    logoutButton = $('#logoutButton'),
    isVisible = false;

channelListHeading.click(function(){
  if(isVisible === false){
    channelList.css('height', '25%');
    isVisible = true;
  }
  else if(isVisible === true){
    channelList.css('height', '0');
    isVisible = false;
  }
});

createChannelButton.click(function(){
  window.location = '/channel/#two';
});

logoutButton.click(function(){
  window.location = '/logout';
});
