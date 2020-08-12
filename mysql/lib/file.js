var s3 = require('./aws.js');

exports.s3_upload=function(Data){
    var param = {
        'Bucket':'wnsgur9609-nodejs',
        'Key': 'test',
        'Body':Data,
        'ContentType':'image/png'
        
    };
    s3.upload(param, function(err, data){
        if(err) {
            console.log(err);
        }
        console.log(data);
    });
};