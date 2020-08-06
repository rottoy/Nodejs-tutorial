var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');
exports.home=function(request,response){
    db.query(`SELECT * FROM topic`, function(error,topics){
        db.query(`SELECT * FROM author`, function(error2,authors){
        
        var title='Author'; 
        var list =template.list(topics);
        var html=template.html(title,list,
            `
            <table>
              ${template.authorTable(authors)}
            </table>
            <style>
              table{
                  border-collapse:collapse;
              }
              td{
                  border:1px solid black;
              }
            </style>
            <form action='author_create_process' method='post'>
            <p><input type="text" name='name' placeholder='name'</p>
            <p><textarea name="profile" placeholder='description'></textarea>
            <p><input type=submit></p>
            </form>
            `,
            `
            `);
        
        response.writeHead(200);
        response.end(html);
     });
    });
    
}

exports.create_process= function(request,response){

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
        db.query(`INSERT INTO author (name , profile) VALUES (?,?)`,
        [post.name,post.profile], function(error,result){
            if(error){throw error;}
            response.writeHead(302,{Location : `/author`});
            response.end('success');
     
        });

    });

}

exports.update=function(request,response){
   
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var title='Author'; 
    db.query('SELECT * FROM topic',function(error,topics){
        if(error){throw error};
        db.query(`SELECT * FROM author where id=?`,(queryData.id), function(error2,author){
            if(error2){throw error;}
            db.query(`SELECT * FROM author`,function(error3,authors){
                var list =template.list(topics);
                var html=template.html(title,list,
                    `
                    <table>
                      ${template.authorTable(authors)}
                    </table>
                    <style>
                      table{
                          border-collapse:collapse;
                      }
                      td{
                          border:1px solid black;
                      }
                    </style>
                    <form action='update_process' method='post'>
                    <input type="hidden" name="id" value="${author[0].id}">
                    <p><input type="text" name='name' placeholder='name' value=${author[0].name}></p>
                    <p><textarea name="profile" placeholder='description'>${author[0].profile}</textarea>
                    <p><input type=submit></p>
                    </form>
                    `,
                    `
                    `);
                
                response.writeHead(200);
                response.end(html);
            });
           
        });
    })
}

exports.update_process= function(request,response){

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

         db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
         [post.name,post.profile, post.id], function(error,result){
             if(error){throw error;}
             response.writeHead(302,{Location : `/author`});
             response.end('success');
      
         });
    });
}

exports.delete_process = function(request,response){
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
         DELETE FROM author WHERE id=?`, post.id, function(error,result){
             if(error){throw error;}
             response.writeHead(302,{Location : `/author`});
             response.end('success');
      
         });
         
    });
}