function readFile(func){
	//open the file
	//read the file
	func();
}


readFile(function(){
	console.log('reading a file');
});


