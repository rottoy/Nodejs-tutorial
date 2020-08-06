var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('../node_modules/sanitize-html'); 
var mysql      = require('../node_modules/mysql');
var template = require('./lib/template.js')

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'opentutorials'
});
db.connect();

//http server open.
//개설 완료 시 , 콜백 함수로 request 반환.
//response로 클라이언트에게 응답
var app = http.createServer(function(request,response){
    var _url = request.url;
    var parsedUrl=url.parse(_url,true);
    var queryData = url.parse(_url,true).query;
    var pathname= url.parse(_url,true).pathname;
    var title=queryData.id;

    //console.log(parsedUrl);
    
    if(pathname ==='/'){ // Root url request

        if(queryData.id===undefined){//no query string

            db.query(`SELECT * FROM topic`, function(error,topics){
                var title='Welcome'; 
                var description = 'Hello, Node.js';
                var list =template.list(topics);
                var html=template.html(title,list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                
                console.log(topics);
                response.writeHead(200);
                response.end(html);
            });
  
        }
        else{ // if query string exists
            db.query(`SELECT * FROM topic`, function(error,topics){
                if(error){throw error;}
                db.query(`SELECT * FROM topic where id=?`,(queryData.id), function(error2,topic){
                    if(error2){throw error;}
                    console.log(topic);
                    var title=topic[0].title; 
                    var description = topic[0].description;
                    var list =template.list(topics);
                    var html=template.html(title,list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                        </form>`);
                    
                    console.log(topics);
                    
                    response.writeHead(200);
                    //response.end('html');
                    response.end(html);
                });
            });
            
        };
   
    
    }
    else if(pathname=='/create'){ // response with POST Form
        db.query(`SELECT * FROM topic`, function(error,topics){
            var title='Web - create'; 
            var list =template.list(topics);
            var html=template.html(title,list,
                `<form action="http://localhost:3000/create_process" method='POST'>
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>`,``);
            
            console.log(topics);
            response.writeHead(200);
            response.end(html);
        });
        
    }
    else if(pathname=='/create_process'){
        var body='';

        //request.on : 데이터가 부분으로 들어옴
        request.on('data', function(data){
            body= body+data;
            //body is POST data

            //console.log(body);
            //title=1234235&description=325235
        });

        //request.end : 정보 수신이 끝났을 때 실행
        request.on('end',function(){
            
            //return json of body
             var post = qs.parse(body);

            //db write
            //INSERT INTO `topic` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11',1);
            db.query(`
            INSERT INTO topic (title , description ,created , author_id)
            VALUES (?,?,NOW(),?)`,
            [post.title,post.description, 1],
            function(error,result){
                if(error){throw error;}
                response.writeHead(302,{Location : `/?id=${result.insertId}`});
                response.end('success');
         
            });

        });

     
    }
    else if(pathname==='/update'){
        fs.readdir('../data',function(error,filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`../data/${filteredId}`,'utf-8',function(err,description){
                var title=queryData.id;
                var list =template.list(filelist);
                var html=template.html(title,list,
                    `  <form action="http://localhost:3000/update_process" method='POST'>
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>`,
                    `<a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    `);
                //200(OK)를 반환
                response.writeHead(200);
                response.end(html);
            });
        });
    }
    else if(pathname==='/update_process'){
        var body='';

        //request.on : 파일 데이터가 부분으로 들어옴
        request.on('data', function(data){
            body= body+data;
            //body is POST data

        });

        //request.end : 정보 수신이 끝났을 때 실행
        request.on('end',function(){
            
            //return json of body
             var post = qs.parse(body);
             var id =post.id;
             var title=post.title;
             var description=post.description;
             console.log(post);
             //File rename
             fs.rename(`../data/${id}`,`../data/${title}`,function(err){
                 //File contents rewrite
                fs.writeFile(`../data/${title}`,description,'utf-8',function(err){
                    //Redirection : 302
                    response.writeHead(302,{Location : `/?id=${title}`});
                    response.end('success');
                 })
    

             });
        });
    }
    else if(pathname==='/delete_process'){
        var body='';

        //request.on : 데이터가 부분으로 들어옴
        request.on('data', function(data){
            body= body+data;
            //body is POST data
        });

        //request.end : 정보 수신이 끝났을 때 실행
        request.on('end',function(){
            
            //return json of body
             var post = qs.parse(body);
             var id =post.id;

             //file delete
             var filteredId = path.parse(id).base;
             fs.unlink(`../data/${filteredId}`,function(error){
                response.writeHead(302,{Location : `/`});
                response.end();
             });
        });
    }
    else{
        response.writeHead(404);
        response.end('Not Found');
    }
   

 });
app.listen(3000);