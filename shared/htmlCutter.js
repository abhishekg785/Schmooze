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
module.exports = function(HTML){     /* HTML is the passed string to work on */
  console.log(HTML);
}
