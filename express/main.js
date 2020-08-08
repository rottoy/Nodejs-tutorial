const express=require('express');
const app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var bodyparser =require('body-parser');
var path= require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var compression=require('compression');
var topicRouter=require('./routes/topic.js');
//사용자가 제공한 form data를 내부적으로 분석하여
//모든 데이터를 
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(compression());

app.get('*',function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    //request의 list를 filelist로 지정
    request.list=filelist;
    
    //그 다음에 호출되어야 할 미들웨어 실행하는 함수
    next();
  });
})
app.use('/topic',topicRouter);



app.get('/', (request,response) => {
  
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src='/images/hello.jpg' style='width:200px; display:block; margin:10px'`,
      `<a href="/topic/create">create</a>`
    );
    response.send(html);
  
});


app.use(function(req,res,next){
  res.status(404).send('Sorry cant find that!!');
})

app.use(function(err, req, res, next){
  console.error(err.stack);
	res.status(500).send('Something broke!');
})


app.listen(3000, ()=> console.log('Example app listening on port 3000!'))
