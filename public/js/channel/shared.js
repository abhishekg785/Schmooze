/*
*  author : abhishek goswami (hiro)
*  abhishekg785@gmail.com
*
*  shared.js : js file shared b/w channel_view and globalChat view
*/

var commandView = $('#commandView'),
    closeCommandView = $('#closeCommandView'),
    commandButton = $('#commandButton');

var SharedFunctions = {
  showCommandView : function(){
    commandView.show();
  },

  hideCommandView : function(){
    commandView.hide();
  }
}
$('document').ready(function(){
  closeCommandView.click(function(){
    SharedFunctions.hideCommandView();
  });

  commandButton.click(function(){
    SharedFunctions.showCommandView();
  });
});
