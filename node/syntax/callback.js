var fs = require('fs');



/*
//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/
// 결과 : A, result, C

//readFileAsync
console.log('A');
fs.readFile('../data/sample.txt','utf-8',function(err,result){
    console.log(result);    
});
console.log('C');

//결과 : A,C,result(바뀔수도 있음)