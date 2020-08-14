var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template')
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');
//http server open.
//개설 완료 시 , 콜백 함수로 요청 온 request 반환.
//response로 클라이언트에게 응답
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname= url.parse(_url,true).pathname;

    if(pathname ==='/'){ // Root url request
        if(queryData.id===undefined){//no query string
           topic.home(request,response);
        }
        else{ // if query string exists
            topic.page(request,response);
        };
    } else if(pathname === '/create'){   // renderd FROM /;
        topic.create(request,response);// response POST TO create_process
    } else if(pathname === '/create_process'){ // requested FROM create
        topic.create_process(request,response);
    } else if(pathname === '/update'){ // rendered FROM /?id=*;
        topic.update(request,response);// response to /update_process
    } else if(pathname === '/update_process'){ //requested FROM /update;                                
        topic.update_process(request,response);//redirect TO /?id=resultId
    } else if(pathname === '/delete_process'){ // requested FROM /?id=* 
        topic.delete_process(request,response);
    } else if(pathname === '/author'){
        author.home(request,response);
    } else if(pathname === '/author_create_process'){
        author.create_process(request,response);
    } else if(pathname === '/author/update'){
        author.update(request,response);
    } else if(pathname === '/author/update_process'){
        author.update_process(request,response);
    } else if(pathname === '/author/delete_process'){
        author.delete_process(request,response);
    } else if(pathname === '/testapi/'){
        response.writeHead(200);
        response.end('succes');
    }
    else{
        response.writeHead(404);
        response.end('Not Found');
    }
   

 });

app.listen(3000);