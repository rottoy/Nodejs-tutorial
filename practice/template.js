const template={
    HTML : function (title,list,body,CRUD){
        var template=`<!DOCTYPE html>
        <html>
            <head>
                <title>Welcome to Junhyeok Practice!</title>
            </head>
            <body>
                <h1>Welcome to Junhyeok ${title}!</h1>
                ${list}
                ${body}
                <br><br>
                ${CRUD}
            </body>
        </html>`;

        return template;

    },
    list : function(filelist){
        var body=`<ul>`;
        var i=0;
        while(i < filelist.length){
            body+=`<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`;
            i++;
        }
        body+=`</ul>`
        return body;
    }
}

module.exports = template;


/*list
<ol>
                    <li><a href='/?id=HTML'>HTML</a></li>
                    <li><a href='/?id=CSS'>CSS</a></li>
                    <li><a href='/?id=Javascript'>Javascript</a></li>
                </ol>
*/ 

/*body
title & description

*/

/* CRUD
<a href='/create'></a>
*/