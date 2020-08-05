//배열
// 정보 가져오는 방법 : 인덱스
// 반복문으로 가져오는 방법 : for i=0 ; i<arr.length 
var members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]);

var i=0;
while(i< members.length){
    console.log('array loop',members[i] );
    i=i+1;
}

//객체
// 정보 가져오는 방법 : 키
// 반복문으로 가져오는 방법 : for elem in object
var roles={
    'programmer' : 'egoing',
    'designer' : 'k8805',
    'manager' : 'hoya'
}
console.log(roles['designer']);
console.log(roles.designer);
//객체의 반복
for(var name in roles){
    console.log('object=>',name,'value=> ', roles[name]);
}