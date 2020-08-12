var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');

exports.home = function(request,response){
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

exports.page= function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    db.query(`SELECT * FROM topic`, function(error,topics){
        if(error){throw error;}
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id where topic.id=?`,(queryData.id), function(error2,topic){
            if(error2){throw error;}

            var title=topic[0].title; 
            var description = topic[0].description;
            var list =template.list(topics);
            var html=template.html(title,list,
                `<h2>${title}</h2>
                ${description}
                <p>by ${topic[0].name}</p>
                `,
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
    


}

exports.create=function(reqeust,response){

    db.query(`SELECT * FROM topic`, function(error,topics){
        db.query(`SELECT * FROM author`,function(error2,authors){
            
            
            var title='Web - create'; 
            var list =template.list(topics);
            var html=template.html(title,list,
            `<form action="http://localhost:3000/create_process" method='POST'>
            <p><input type="text" name="title" placeholder="title"></p>
            <p>${template.authorSelect(authors)}</p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="file" name="profile">
            <p><input type="submit"></p>
            </form>`,``);
        
            console.log(topics);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process=function(request,response){

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
        console.log(post);
        //db write
        db.query(`INSERT INTO topic (title , description ,created , author_id) VALUES (?,?,NOW(),?)`,
        [post.title,post.description, post.author], function(error,result){
            if(error){throw error;}
            response.writeHead(302,{Location : `/?id=${result.insertId}`});
            response.end('success');
     
        });

    });

}

exports.update = function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    db.query('SELECT * FROM topic',function(error,topics){
        if(error){throw error};
        db.query(`SELECT * FROM topic where id=?`,(queryData.id), function(error2,topic){
            if(error2){throw error;}
            db.query(`SELECT * FROM author`,function(error3,authors){
                var list =template.list(topics);
                var html=template.html(topic[0].title,list,
                    `<form action="http://localhost:3000/update_process" method='POST'>
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                    <p><textarea name="description" placeholder="description">${topic[0].description}</textarea> </p>
                    <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                    <p><input type="submit"></p>
                    </form>`,
                    `<a href="/create">create</a><a href="/update?id=${topic[0].id}">update</a>`);
                
                response.writeHead(200);
                response.end(html);
            });
           
        });
    })
}

exports.update_process=function(request,response){

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

exports.delete_process=function(request,response){
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