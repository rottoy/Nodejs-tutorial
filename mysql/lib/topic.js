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
            <p><input type="file" multiple="multiple" name="profile[]">
            <p><input type="submit"></p>
            </form>`,``);
        
            //console.log(topics);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process=function(request,response){
    //sync - auto_increment for insert querying and s3 uploading , form parse for file uploading 
    //async - s3 upload, db insert query
    db.query(`select auto_increment from information_schema.TABLES where TABLE_NAME ='topic' and TABLE_SCHEMA='opentutorials';`,function(err,index){
        const topic_id=index[0].AUTO_INCREMENT;
        console.log(topic_id);
       //const topic_id = 34;
        let topic;
    
        let form = new formidable.IncomingForm();
            form.encoding = 'utf-8';

            form.parse(request, function (err, fields, files) {
                topic=fields;
                //console.log('form parsing -> file object :',files);
            });
    
        form.on('end', function(fields, files) {
            if(topic===undefined){
                console.log('error occured');
                response.writeHead(500);
                response.end('topic->create_process->form parsing failed');
            }
            else{
                
                //console.log(" 총 업로드 파일 갯수 == ", this.openedFiles.length);
                for(var i = 0; i < this.openedFiles.length; i++){
                    if(this.openedFiles[i].size===0)continue;
                    
                    const file_path = this.openedFiles[i].path;
                    const file_name = this.openedFiles[i].name;
                    const file_type = this.openedFiles[i].type;
                    console.log('file path : '+file_path);
                    console.log('file name : '+file_name);
                    fs.readFile(file_path,function(err2,file_data){ 
                        if(err2) throw err2;
                                                   
                            const file_path = `post_directory/${topic_id}/${file_name}`;
                            const s3_file_path = s3_module.path_name+file_path;
                            s3_module.s3_upload(file_path,file_data,file_type);
                            db.query(`INSERT INTO file (topic_id, file_path, file_type , file_name) VALUES (?,?,?,?);`,[topic_id,s3_file_path,file_type,file_name]);  
                    });

                }
                db.query(`INSERT INTO topic (title , description ,created , author_id) VALUES (?,?,NOW(),?);`,[topic.title,topic.description, topic.author],
                function(err3,result){
                    //console.log(result.insertId);
                    db.query(`ANALYZE TABLE opentutorials.topic;`);
                    response.writeHead(302,{Location : `/?id=${result.insertId}`});
                    response.end('success');
                });
                
            }

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