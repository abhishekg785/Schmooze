/**
* @author : abhishek goswami
* abhishekg785@gmail.com
*
* autocomplete.js : file handle the ai autocomplete response for the user input
*/

(function(d) {
  var messageText = $('#messageText'),
      suggestionView = $('#suggestionView');


  AutocompleteFunctions = {

    /**
    *  @param ( String, String )
    */
    FetchSuggestions : function(lastWord, secondLastWord) {
      console.log('LastWord : ' + lastWord);
      console.log('secondLastWord : ' + secondLastWord); 
      var url;
      if(secondLastWord != undefined) {
        url = "http://localhost:8080/" + secondLastWord + "/" + lastWord ;
      }
      else {
        url = "http://localhost:8080/" + lastWord + "/";
      }

      AutocompleteFunctions.SendRequestToFecthData(url);
    },

    SendRequestToFecthData : function(url) {
      console.log(url);
      $.ajax({
        url : url,
        type : 'GET', 
        success : function(data) {
          console.log('IN THE SUCCESS FUNCTION');
          AutocompleteFunctions.ShowSuggestionView().PopulateSuggestionsInView(data);
        },
        error : function(error) {
          console.log(error);
        }
      });
    },

    ShowSuggestionView : function() {
        suggestionView.css('display', 'block');
        return AutocompleteFunctions;
    },

    HideSuggestionView : function() {
        suggestionView.css('display', 'none');
    },

    PopulateSuggestionsInView : function(data) {
      AutocompleteFunctions.ClearSuggestionView();
      console.log('IN THE PopulateSuggestionsInView');
      // $('#suggestionView ul').append('<li>dkckdbckjdbck</li>');
      for(var val in data) {
        var key = val;
        var keyVal = data[val];
        var item = "<li onclick = 'AutocompleteFunctions.SetSuggestionInMessageText("+ '"' + val + '"' +")' >"+ key +"</li>";
        $('#suggestionView ul').append(item);
      }
    },

    ClearSuggestionView : function() {
      $('#suggestionView ul').empty();
    },

    SetSuggestionInMessageText : function(suggestion){
      // $('#messageText').val($('#messageText').val() + ' ' + suggestion);
      var pervMessageText = $('#messageText').val();
      var prevMessageWordArray = pervMessageText.split(' ');
      var lastWordIndex = prevMessageWordArray.length - 1;
      prevMessageWordArray.splice(lastWordIndex);
      prevMessageWordArray.push(suggestion);
      var newMessage = prevMessageWordArray.join(' ');
      $('#messageText').val(newMessage);
      $('#messageText').focus();
    }
    
  }

  /*
  * fetch the input string (inputText)
  * find the last word from the inputText and then fetch the next suggestions
  * if the secondLastWord is undefined , it means user has typed one word
  */
  messageText.on('keyup', function(e) {
    var inputText = messageText.val().trim();
    if(inputText == '') {
      AutocompleteFunctions.HideSuggestionView();
    }
    var wordArray = inputText.split(' ');
    var lastWord = wordArray[wordArray.length - 1];
    var secondLastWord = wordArray[wordArray.length - 2];
    AutocompleteFunctions.FetchSuggestions(lastWord, secondLastWord);
  });

})(document);
