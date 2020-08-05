var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var parsedUrl=url.parse(_url,true);
    var queryData = url.parse(_url,true).query;
    var pathname= url.parse(_url,true).pathname;
    var title=queryData.id;

    console.log(parsedUrl);
    
    if(pathname ==='/'){
        if(queryData.id===undefined){
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
            var title='Welcome';
            var description = 'Hello, Node.js';
            var template=`
                <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>
                `;
            //200(OK)를 반환
            response.writeHead(200);
            response.end(template);
        });
    }
    else{
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
            var title=queryData.id;
            var template=`
                <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            </body>
            </html>
                `;
            //200(OK)를 반환
            response.writeHead(200);
            response.end(template);
        });
    };
   
    
    }
    else{
    response.writeHead(404);
    response.end('Not Found');
    }
   

 });
app.listen(3000);