var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    console.log(queryData);
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }

    //200(OK)를 반환
    response.writeHead(200);

    //현재 사용자에게 반환할 디렉토리를 출력
    console.log(__dirname+url);
    
    //response : 사용자에게 전송하는 데이터
    //데이터 전송 방법 1. fs
    //node-module의 파일시스템을 이용하여 파일(html)을 클라이언트에게 제공
    //response.end(fs.readFileSync(__dirname + url));

    response.end(queryData.someAttribute);

});
app.listen(3000);