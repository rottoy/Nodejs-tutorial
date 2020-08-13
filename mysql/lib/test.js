var s3 = require('./aws.js');
//console.log(s3);

/*s3.listObjects({Bucket: 'wnsgur9609-nodejs'}).on('success', function handlePage(response) {
    //console.log(response);
    for(var name in response.data.Contents){
        console.log(response.data.Contents[name].Key);
    }
    if (response.hasNextPage()) {
        response.nextPage().on('success', handlePage).send();
    }
}).send();
*/
var options ={

    Bucket:'wnsgur9609-nodejs',
    Key : `post_directory/17/KakaoTalk_20200427_142238087.png`
}
var some=s3.getObject(options,function(err,data){
    if(err)
    console.log(err);
    console.log(data);
});
//console.log(some);
