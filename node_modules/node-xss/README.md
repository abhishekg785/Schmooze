**node-xss is codeigniter like sanitization methods.**

(node-validator.sanitize.xss fork. because object type not support ...)

To install node-xss
```bash
$ npm install node-xss
```

## Example

```javascript
var xss = require('node-xss').clean;

var obj = {tag:'<alert>test</alert>', value:'1222'};

// Please use the call back usually.
var params = xss(obj);

console.log(params);
// { tag: '&lt;alert&gt;test&lt;/alert&gt;', value: '1222' }

```

## List of sanitization / filter methods

```javascript
xss()                           //Remove common XSS attack vectors from user-supplied HTML
xss(true)                       //Remove common XSS attack vectors from images
```

## LICENSE

(MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
