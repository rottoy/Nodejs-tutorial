var s3 = require('./aws.js');

exports.s3_upload=function(file_path,file_data,file_type){
    var param = {
        'Bucket':'wnsgur9609-nodejs',
        'Key': file_path, 
        'Body':file_data,
        'ContentType':file_type
        
    };
    s3.upload(param, function(err, data){
        if(err) {
           console.log('file.js->s3->upload : error - ',err);
        }
        console.log('file.js -> s3 -> upload : success');
        console.log(data.Location)
    });
};

exports.buck_name='wnsgur9609-nodejs';
exports.host_name='s3.amazonaws.com';
exports.path_name=`https://${this.buck_name}.${this.host_name}/`;

// database - param
// id : auto-increment
/// topic_id : d
// file_path : param.Key
// file_type : param.ContentType
