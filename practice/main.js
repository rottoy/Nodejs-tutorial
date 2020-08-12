const http = require('http');
const qs = require('qs');
const url = require('url');
const fs = require('fs');
const template=require('./template.js');

const app= http.createServer(function(request,response){
    const _url=request.url;
    const queryData = url.parse(_url,true).query;
    const pathName= url.parse(_url,true).pathname;
    if(pathName==='/'){
        if(queryData.id===undefined){
            fs.readdir('./data',function(error,filelist){
               
            var title='welcome to NodeJs!';
            var description ='';
            var list=template.list(filelist);
            
            var html=template.HTML('World!',list,`<h2>${title}</h2>${description}`,`<a href='/create'>Create</a>`);
            response.writeHead(200);
            response.end(html);
            });
        }
        else{
            var filteredId=queryData.id;
            console.log(filteredId);
            fs.readdir('./data',function(error,filelist){
                fs.readFile(`./data/${filteredId}`,'utf-8',function(err,description){
                    
                    var title=filteredId;
                    var list=template.list(filelist);
                    console.log(list);
                    var html=template.HTML(title,list,
                        `<h2>${title}</h2>${description}`,
                        `<a href='/create'>Create</a>   
                        <a href='/update?id=${filteredId}'>Update</a>
                        <a href='delete?id=${filteredId}'>Delete</a>`);
                    response.writeHead(200);
                    response.end(html);
                });
    
            });
        }
    }
    else if(pathName==='/create'){
        fs.readdir('./data',function(error,filelist){
            var list = template.list(filelist);
            var title='Web- Create';
            var html=template.HTML(title,list,
            ``,
            `<form action="create_process" method='POST'>
            <p><input type='text' name='title' placeholder='title'></p>
            <p><textarea name='description' placeholder='description'></textarea>
            <p><input type=submit></p>
            </form>`);
            response.writeHead(200);
            response.end(html);
        });
    }
    else if(pathName==='/create_process'){
        var body=``;
        request.on('data',function(data){
            body+=data;
        });

        request.on('end',function(){
            //console.log(body);
            var jsonBody=qs.parse(body);
            var title= jsonBody.title;
            var description = jsonBody.description;
            fs.writeFile(`./data/${title}`,description,function(){
                response.writeHead(302,{'Location' : `/?id=${title}`});
                response.end();
            })
            
        });
        //fs.writeFile()
       
    }else if(pathName ==='/update'){
        var filteredId=queryData.id;
        console.log(filteredId);
        fs.readdir('./data',function(error,filelist){
            fs.readFile(`./data/${filteredId}`,'utf-8',function(err,description){
                
                var title=filteredId;
                var list=template.list(filelist);
                console.log(list);
                var html=template.HTML(title,list,
                    `<form action="update_process" method='POST'>
                    <input type='hidden' name='id' value=${title}>
                    <p><input type='text' name='title' placeholder='title' value=${title}></p>
                    <p><textarea name='description' placeholder='description'>${description}</textarea>
                    <p><input type=submit></p>
                    </form>`,
                    `<a href='/create'>Create</a>   <a href='/update?id=${filteredId}'>Update</a> `);
                response.writeHead(200);
                response.end(html);
            });

        });

    }else if(pathName==='/update_process'){
        var body=``;
        request.on('data',function(data){
            body+=data;
        });

        request.on('end',function(){
            //console.log(body);
            var jsonBody=qs.parse(body);
            var id = jsonBody.id;
            var title= jsonBody.title;
            var description = jsonBody.description;
            fs.rename(`./data/${id}`,`./data/${title}`,function(err){
                fs.writeFile(`./data/${title}`,description,function(){
                    response.writeHead(302,{'Location' : `/?id=${title}`});
                    response.end();
                });

            });
            
            
        });

    }else if(pathName==='/delete'){
        var filteredId=queryData.id;
        fs.unlink(`./data/${filteredId}`,function(){

            response.writeHead(302,{'Location' : `/`});
            response.end();
        });

        

    }
    
    
})

app.listen(3000);

/*
pathname : path portion
path : path portion + search portion
url.parse() : 기능에 맞게 파싱해줌. json같은 것도 반환 가능.
*/