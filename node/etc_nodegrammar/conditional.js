var args=process.argv;
//argv : 프로세스의 정보
//argv[0] : 노드js 런타임 위치 경로
//argv[1] : 실행시킨 파일의 경로
//argv[2] : 우리가 입력한 인자

console.log(args[2]);
console.log('A');
console.log('B');
if(args[2]=='1'){
    console.log('C1');    
}else{
    console.log('C2');
}
console.log('D');