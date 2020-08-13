var s3 = require('./aws.js');

exports.s3_upload=function(file_path,file_data){
    var param = {
        'Bucket':'wnsgur9609-nodejs',
        'Key': file_path, 
        'Body':file_data,
        'ContentType':'image/png'
        
    };
    s3.upload(param, function(err, data){
        if(err) {
           console.log('file.js->s3->upload : error - ',err);
        }
        console.log('file.js -> s3 -> upload : success');
        console.log(data.Location)
    });
};

// database - param
// id : auto-increment
/// topic_id : d
// file_path : param.Key
// file_type : param.ContentType
