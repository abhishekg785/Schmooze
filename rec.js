function printShit(string){
	console.log(string);
	if(string.indexOf('shit happens') == -1){
		return;
	}
	else{
		string = string.replace('s', 'shit happens');
		return printShit(string);
	}
}

printShit('shit happens');
