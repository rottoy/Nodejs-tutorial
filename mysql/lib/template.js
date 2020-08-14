module.exports={

      //HTML template 반환
    html : function (title, list, body, control){
        return `
        <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    <a href='/author'>author</a>
    ${list}
    ${control}
    ${body}
    </body>
    </html>
        `;
    },
    //HTML template 중 List 반환

    list : function (topics){
        var list='<ul>';
        var i=0;
        while(i<topics.length){
            list=list+`<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`
            i=i+1;
        }
        list = list+'</ul>';
        return list;
    }
    ,
    filelist : function(files){
        var list='<ul>';
        var i=0;
        while(i<files.length){
            list=list+`<li><a href="${files[i].file_path}">${files[i].file_name}</a></li>`
            i=i+1;
        }
        list = list+'</ul>';
        return list;

    }
    ,
    authorSelect:function(authors,author_id){
        var tag='';
        var i=0;
        console.log('AUthors length : ',authors.length);
        while(i<authors.length){
            var selected='';
            console.log(authors[i].name ,' ' ,author_id);
            if(authors[i].id===author_id){
                selected=' selected';
                console.log('hello');
            }
            tag = tag + `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i=i+1;
        }
        return `<select name="author">${tag}</select>`;
    },
    authorTable:function(authors){
        var tag='<table>';
        var i=0;
        while(i<authors.length){
            tag+=`
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href='/author/update?id=${authors[i].id}'>update</a></td>
                <td>
                <form action='/author/delete_process' method='POST'>
                <input type='hidden' name='id' value=${authors[i].id}>
                <input type='submit' value='delete'>
                </form>
                </td>

            </tr>`;
            i++;
        }
        tag+='</table';
        return tag;
    }
};

