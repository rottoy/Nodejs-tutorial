var fs = require('fs');



/*
//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/

//readFileAsync
console.log('A');
fs.readFile('../data/sample.txt','utf-8',function(err,result){
    console.log(result);    
});
console.log('C');