function bracketCutter(htmlString){
	console.log(htmlString);
	    if(htmlString.indexOf("<") == -1 && htmlString.indexOf(">") == -1 ){
		    var str = htmlString;
		    console.log('Returned String' + str);
		    return htmlString ;
			      }
	        
			      if(htmlString.indexOf("<") != -1){
				             htmlString =  htmlString.replace("<", '&lt');
					            }
			            if(htmlString.indexOf(">") != -1){
					            htmlString = htmlString.replace(">", '&gt');
						          }
		             	   return bracketCutter(htmlString);
}

str = bracketCutter('<script>alert("cdjkbcdkc");</script>');
console.log(str);
