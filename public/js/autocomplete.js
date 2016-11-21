/**
* @author : abhishek goswami
* abhishekg785@gmail.com
*
* autocomplete.js : file handle the ai autocomplete response for the user input
*/

(function(d) {
  var messageText = $('#messageText');

  AutocompleteFunctions = {
    FetchSuggestions : function(lastWord, secondLastWord) {
      console.log('LastWord : ' + lastWord);
      console.log('secondLastWord : ' + secondLastWord); 
      // $.ajax({
      //   url : '',
      //   type : 'POST',
      //   success : function(data) {
      //     console.log(data);
      //   },
      //   error : function(error) {
      //     console.log(error);
      //   }
      // });
    }
  }

  /*
  * fetch the input string (inputText)
  * find the last word from the inputText and then fetch the next suggestions
  */
  messageText.on('keyup', function(e) {
    var inputText = messageText.val().trim();
    var wordArray = inputText.split(' ');
    var lastWord = wordArray[wordArray.length - 1];
    var secondLastWord = wordArray[wordArray.length - 2];
    AutocompleteFunctions.FetchSuggestions(lastWord, secondLastWord);
  });
})(document);
