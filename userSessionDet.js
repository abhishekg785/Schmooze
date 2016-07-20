var userDet = {
	'abhi':{
		'username':'abhishek',
		'session_ids':[1,2,3]
	}
}

console.log(userDet['abhi']);
obj = {
	'username':'sushma',
	'session_ids':[1,5,6]
}

userDet['sushma'] = obj;

console.log(userDet['sushma']);
console.log(Object.keys(userDet));
userDet['sushma']['session_ids'].splice(1,1);
console.log(userDet['sushma']);
