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

//마찬가지로 객체의 원소로 함수가 들어갈 수 있음.
//배열과 객체는 모두 연관된 데이터를 담는 그릇인데,
//처리방식을 담는 함수 조차도 데이터로 존재할 수 있다.
var o ={
    func : f
};
o.func();