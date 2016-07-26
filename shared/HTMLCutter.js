/*
*  author: abhishek goswami
*  abhishekg785@gmail.com
*
*  module for rendering the html as unrendered html to prevent XSS ATTACKS and js injection
*/

var IgnoreWordArr = [
  'js',
  'javascript',
  'alert',
  'vbscript',
  'document',
  'window'
];

var HTMLCutterFunctions = {
  bracketCutter : function(htmlString){
    if(htmlString.indexOf("<") == -1 && htmlString.indexOf(">") == -1 ){        /* base condition of the recursion */
      return htmlString;
    }
    else{
      if(htmlString.indexOf("<") != -1){
        htmlString = htmlString.replace("<", '&lt');
      }
      if(htmlString.indexOf(">") != -1){
        htmlString = htmlString.replace(">", '&gt');
      }
      return HTMLCutterFunctions.bracketCutter(htmlString);
    }
  },

  symbolCutter : function(htmlString){
    console.log(htmlString);
    if(htmlString.indexOf('(&)') != -1){
      return htmlString;
    }
    else{
      htmlString = htmlString.replace('&', '(&)');
      return HTMLCutterFunctions.symbolCutter(htmlString);
    }
  }
}

module.exports = function(HTMLString){     /* HTML is the passed string to work on */
  // console.log(HTML);
  if(HTMLString.indexOf('&') != -1){
    HTMLString = HTMLCutterFunctions.symbolCutter(HTMLString);
  }
  var parsedString = HTMLCutterFunctions.bracketCutter(HTMLString);
  return parsedString;
}
