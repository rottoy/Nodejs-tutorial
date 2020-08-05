var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, description){
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
<h2>${title}</h2>
<p>${description}</p>
</body>
</html>
    `;
}
var app = http.createServer(function(request,response){
    var _url = request.url;
    var parsedUrl=url.parse(_url,true);
    var queryData = url.parse(_url,true).query;
    var pathname= url.parse(_url,true).pathname;
    var title=queryData.id;

    console.log(parsedUrl);
    
    if(pathname ==='/'){
        if(queryData.id===undefined){
        fs.readdir('./data',function(error,filelist){
            var title='Welcome';
            var description = 'Hello, Node.js';
            var list='<ul>';
            var i=0;
            while(i<filelist.length){
                list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                i=i+1;
            }
            list = list+'</ul>';
            var template=templateHTML(title,list,description);
            //200(OK)를 반환
            response.writeHead(200);
            response.end(template);
        });
    }
    else{
        fs.readdir('./data',function(error,filelist){
            var title='Welcome';
            var description = 'Hello, Node.js';
            var list='<ul>';
            var i=0;
            while(i<filelist.length){
                list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                i=i+1;
            }
            list = list+'</ul>';
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
                ${list};
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                    `;
                //200(OK)를 반환
                response.writeHead(200);
                response.end(template);
            });
         });
    
    };
   
    
    }
    else{
    response.writeHead(404);
    response.end('Not Found');
    }
   

 });
app.listen(3000);