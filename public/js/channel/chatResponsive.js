/*
*  author :abhishek goswami
*  abhishekg785@gmail.com
*
*  chatResponsive.js : js file to make the overall chat exp respossive
*  < code is creepy :) ! forgive me for that >
*/

  var showChannelSlide = $('#showChannelSlide'),
      showUserSlide = $('#showUserSlide'),
      isChannelSlideVisible = false,
      isUserSlideVisible = false,
      channelArea = $('#channelArea'),
      onlineUserArea = $('#onlineUserArea');

  showChannelSlide.on('click', function(){
    if(!isChannelSlideVisible){
      channelArea.css("display", 'block');
      channelArea.css('width', '160px');
      showChannelSlide.css('left', '160px');
      showChannelSlide.text('<');
      isChannelSlideVisible = true;
    }
    else{
      channelArea.css('display', 'none');
      showChannelSlide.css('left', '0px');
      showChannelSlide.text('>');
      isChannelSlideVisible = false;
    }
  });

  showUserSlide.on('click', function(){
    if(!isUserSlideVisible){
      onlineUserArea.css('display', 'block');
      onlineUserArea.css('width', '160px');
      showUserSlide.css('right','160px')
      showUserSlide.text('>');
      isUserSlideVisible = true;
    }
    else{
      onlineUserArea.css('display', 'none');
      showUserSlide.css('right', '0px');
      showUserSlide.text('<');
      isUserSlideVisible = false;
    }
  });

  $(window).resize(function(){
    if(window.innerWidth > 1025){
      channelArea.css('display', 'block');
      channelArea.css('width', '15%');;
      onlineUserArea.css('display', 'block');
      onlineUserArea.css('width','15%');
    }
    else{
      channelArea.css('display', 'none');
      showChannelSlide.css('left',' 0px');
      showChannelSlide.text('>');
      onlineUserArea.css('display', 'none');
      showUserSlide.css('right', '0px');
      showUserSlide.text('<');
    }
  });
