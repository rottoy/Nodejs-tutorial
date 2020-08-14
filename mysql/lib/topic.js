var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var formidable = require('formidable');
var fs = require('fs');
var s3_module = require('./s3.js');
//console.log(s3);
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

            db.query(`SELECT * FROM file where topic_id=?`,(queryData.id),function(error3, files){
                
                var title=topic[0].title; 
                var description = topic[0].description;
                var list =template.list(topics);
                var filelist = template.filelist(files);
                var html=template.html(title,list,
                `
                <h2>${title}</h2>      
                ${description}
                <p>by ${topic[0].name}</p>
                `,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
                </form>
                ${filelist}
                `);
            //bucketName, db의 디렉토리   
            //response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
            response.writeHead(200);
            response.end(html);
            });
            
        });
    });
    


}

exports.create=function(reqeust,response){

    db.query(`SELECT * FROM topic`, function(error,topics){
        db.query(`SELECT * FROM author`,function(error2,authors){
            
            
            var title='Web - create'; 
            var list =template.list(topics);
            var html=template.html(title,list,
            `<form action="http://localhost:3000/create_process" method='POST' enctype="multipart/form-data">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>${template.authorSelect(authors)}</p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="file" multiple="multiple" name="profile">
            <p><input type="submit"></p>
            </form>`,``);
        
            //console.log(topics);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process=function(request,response){

    var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            //console.log(files.profile);
            if(err)throw err;
            
            fs.readFile(files.profile.path,function(err2,file_data){ 
                if(err2) throw err2;
                
                db.query(`INSERT INTO topic (title , description ,created , author_id) VALUES (?,?,NOW(),?);`,[fields.title,fields.description, fields.author],
                function(err3,result){
                    if(err3){throw err3;}
                    
                    const file_name = files.profile.name;
                    const topic_id = result.insertId;
                    const file_path = `post_directory/${topic_id}/${file_name}`;
                    const file_type = files.profile.type;
                    const s3_file_path = s3_module.path_name+file_path;
                    console.log(s3_file_path);
                    s3_module.s3_upload(file_path,file_data,file_type);

                    db.query(`INSERT INTO file (topic_id, file_path, file_type , file_name) VALUES (?,?,?,?);`,[topic_id,s3_file_path,file_type,file_name],function(err4,result2){
                        if(err4)throw err4;
                        response.writeHead(302,{Location : `/?id=${result.insertId}`});
                        response.end('success');
                    });
                        
                });
                
                //console.log(something);
            
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