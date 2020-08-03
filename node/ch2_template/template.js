var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var title = queryData.id;
    console.log(queryData);
    if(_url == '/'){
      //더 이상 정적인 페이지를 사용하지 않겠음!
      //_url = '/index.html';
      title= 'Welcome';
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

    //데이터 전송 방법 2. template
    //template 문법을 사용하여 '동적'인 웹페이지가 생성이 가능하다.
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
        <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
        <img src="coding.jpg" width="100%">
        </p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
        </p>
        </body>
        </html>
            `;
    response.end(template);

});
app.listen(3000);