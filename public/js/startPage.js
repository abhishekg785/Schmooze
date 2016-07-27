/*
*  author : abhishek goswami (hiro)
*  abhishekg785@gmail.com
*
*   startPage.js : js file for handling the startPage functions
*/

  $(document).ready(function(){
    var userMessageForm = $('#messageForm'),
        submitContact = $('submitContact'),
        url = 'http://localhost:3000/contact/',
        sectionThree = $('#three'),
        contactFormDiv = $('#contactFormDiv');

    var startPageFunctions = {
      sendUserContact : function(postData){
        $('#submitContact').val('Sending ...');
        $.ajax({
          url : url,
          type : 'POST',
          data : postData,
          success : function(data){
            startPageFunctions.changeElementValuesToInitial();
            startPageFunctions.messageSentSuccess();
          },
          error : function(){
            startPageFunctions.messageSentError();
          }
        });
      },

      changeElementValuesToInitial : function(){
        $('#message').val('');
        $('#email').val('');
        $('#name').val('');
        $('#submitContact').val('Send');
      },

      messageSentSuccess : function(){
        contactFormDiv.empty();
        contactFormDiv.append('<h1>Your message has been sent Successfully</h1>');
      },

      messageSentError: function(){
        contactFormDiv.empty();
        contactFormDiv.append('<h1>Error Occurred! Try Again!</h1>');
      }
    }
    userMessageForm.on('submit', function(e){
      e.preventDefault();
      var name = $('#name').val(),
          message = $('#message').val(),
          email = $('#email').val();
      if(name == '' || message == '' || email == ''){
        alert('All fields are required !');
      }
      else{
        var postData = {
          user : name,
          message : message,
          email : email
        };
        startPageFunctions.sendUserContact(postData);
      }
    });
  });
