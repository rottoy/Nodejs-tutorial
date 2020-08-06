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
//개설 완료 시 , 콜백 함수로 요청 온 request 반환.
//response로 클라이언트에게 응답
var app = http.createServer(function(request,response){
    var _url = request.url;
    var parsedUrl=url.parse(_url,true);
    var queryData = url.parse(_url,true).query;
    var pathname= url.parse(_url,true).pathname;
    var title=queryData.id;

    if(pathname ==='/'){ // Root url request

        if(queryData.id===undefined){//no query string

            db.query(`SELECT * FROM topic`, function(error,topics){
                var title='Welcome'; 
                var description = 'Hello, Node.js';
                var list =template.list(topics);
                var html=template.html(title,list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                
                response.writeHead(200);
                response.end(html);
            });
  
        }
        else{ // if query string exists
            db.query(`SELECT * FROM topic`, function(error,topics){
                if(error){throw error;}
                db.query(`SELECT * FROM topic where id=?`,(queryData.id), function(error2,topic){
                    if(error2){throw error;}

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
                       
                    response.writeHead(200);
                    response.end(html);
                });
            });
            
        };
   
    
    } 
    else if(pathname=='/create'){   // renderd FROM /;
                                    // response POST TO create_process
        db.query(`SELECT * FROM topic`, function(error,topics){
            var title='Web - create'; 
            var list =template.list(topics);
            var html=template.html(title,list,
                `<form action="http://localhost:3000/create_process" method='POST'>
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>`,``);
            
            console.log(topics);
            response.writeHead(200);
            response.end(html);
        });
        
    }
    else if(pathname=='/create_process'){ // requested FROM create
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

            //db write
            db.query(`INSERT INTO topic (title , description ,created , author_id) VALUES (?,?,NOW(),?)`,
            [post.title,post.description, 1], function(error,result){
                if(error){throw error;}
                response.writeHead(302,{Location : `/?id=${result.insertId}`});
                response.end('success');
         
            });

        });

     
    }
    else if(pathname==='/update'){ // rendered FROM /?id=*;
                                   // response to /update_process
        
        db.query('SELECT * FROM topic',function(error,topics){
            if(error){throw error};
            db.query(`SELECT * FROM topic where id=?`,(queryData.id), function(error2,topic){
                if(error2){throw error;}

                var list =template.list(topics);
                var html=template.html(topic[0].title,list,
                    `<form action="http://localhost:3000/update_process" method='POST'>
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p><textarea name="description" placeholder="description">${topic[0].description}</textarea> </p>
                    <p><input type="submit"></p>
                    </form>`,
                    `<a href="/create">create</a><a href="/update?id=${topic[0].id}">update</a>`);
                
                response.writeHead(200);
                response.end(html);
            });
        })

    }
    else if(pathname==='/update_process'){ //requested FROM /update;
                                           //redirect TO /?id=resultId
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

             db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,
             [post.title,post.description, post.id], function(error,result){
                 if(error){throw error;}
                 response.writeHead(302,{Location : `/?id=${post.id}`});
                 response.end('success');
          
             });
        });

    }
    else if(pathname==='/delete_process'){ // requested FROM /?id=* 
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

             //db delete
             db.query(`
             DELETE FROM topic WHERE id=?`, post.id, function(error,result){
                 if(error){throw error;}
                 response.writeHead(302,{Location : `/`});
                 response.end('success');
          
             });
             
        });
    }
    else{
        response.writeHead(404);
        response.end('Not Found');
    }
   

 });

app.listen(3000);