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
    if(htmlString.indexOf('&') == -1){
      return htmlString;
    }
    else{
      htmlString = htmlString.replace('&', "'and'");
      return HTMLCutterFunctions.symbolCutter(htmlString);
    }
  },

  /*
  *  linkify will add links to all the strings where it matches http:// or wwww.
  */
  linkify : function(HTMLString){
    var pattern1 =  /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim ,  /* url starting with http:// or https:// or ftp:// */
        pattern2 =  /(^|[^\/])(www\.[\S]+(\b|$))/gim;    /* string starting with www.*/
        parsedString = '';
    parsedString = HTMLString.replace(pattern1, '<a style = "color:#8e44ad" href="$1" target="_blank">$1</a>');
    parsedString = parsedString.replace(pattern2, '$1<a style = "color:#8e44ad" href="http://$2" target="_blank">$2</a>');
    return parsedString;
  }
}

module.exports = function(HTMLString){     /* HTML is the passed string to work on */
  // console.log(HTML);
  HTMLString = HTMLString.trim();
  if(HTMLString.indexOf('&') != -1){
    HTMLString = HTMLCutterFunctions.symbolCutter(HTMLString);
  }
  var parsedString = HTMLCutterFunctions.bracketCutter(HTMLString);
  parsedString = HTMLCutterFunctions.linkify(parsedString);
  return parsedString;
}
