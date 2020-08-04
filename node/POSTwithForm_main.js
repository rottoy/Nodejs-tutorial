var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
//HTML template 반환
function templateHTML(title, list, body, control){
        return `
        <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
    </body>
    </html>
        `;
}

//HTML template 중 List 반환
function templateList(filelist){
    var list='<ul>';
    var i=0;
    while(i<filelist.length){
        list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i=i+1;
    }
    list = list+'</ul>';
    return list;
}

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
            fs.readdir('./data',function(error,filelist){
                var title='Welcome'; 
                var description = 'Hello, Node.js';
                var list =templateList(filelist);
                var template=templateHTML(title,list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);

                
                response.writeHead(200);//200(OK)를 반환
                response.end(template);//HTML template 클라이언트에게 응답
             });
        }
        else{ // if query string exists
            fs.readdir('./data',function(error,filelist){
                fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
                    var title=queryData.id;
                    var list =templateList(filelist);
                    var template=templateHTML(title,list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                    //200(OK)를 반환
                    response.writeHead(200);
                    response.end(template);
                });
            });
    
        };
   
    
    }
    else if(pathname=='/create'){ // response with POST Form
        fs.readdir('./data',function(error,filelist){
            var title='Web - create';
            
            var list =templateList(filelist);
            
            var template=templateHTML(title,list,`
            <form action="http://localhost:3000/create_process" method='POST'>
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `,``);
            //200(OK)를 반환
            response.writeHead(200);
            response.end(template);
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
             var title=post.title;
             var description=post.description;

             //File write
             fs.writeFile(`data/${title}`,description,'utf-8',function(err){
                //Redirection : 302
                response.writeHead(302,{Location : `/?id=${title}`});
                response.end('success');
             })

             

        });

     
    }
    else if(pathname==='/update'){
        fs.readdir('./data',function(error,filelist){
            fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
                var title=queryData.id;
                var list =templateList(filelist);
                var template=templateHTML(title,list,
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
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                //200(OK)를 반환
                response.writeHead(200);
                response.end(template);
            });
        });
    }
    else if(pathname==='/update_process'){
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
             var title=post.title;
             var description=post.description;
             console.log(post);
             //File rename
             fs.rename(`data/${id}`,`data/${title}`,function(err){
                fs.writeFile(`data/${title}`,description,'utf-8',function(err){
                    //Redirection : 302
                    response.writeHead(302,{Location : `/?id=${title}`});
                    response.end('success');
                 })
    

             });
        });
    }
    else{
        response.writeHead(404);
        response.end('Not Found');
    }
   

 });
app.listen(3000);