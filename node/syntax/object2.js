// 데이터를 효율적으로 저장하는 방법
// array , object

// 서로 연관된 처리 방법들을 묶는법
// 함수
var f = function(){
	console.log(1+1);
	console.log(1+2);
}
console.log(f);

var a =[f]; //배열의 원소로 함수가 들어갈 수 있음.
a[0](); // f();

var o ={
    func : f
};
o.func();