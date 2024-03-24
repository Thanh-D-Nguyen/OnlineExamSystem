var mongoose = require("mongoose");
var config = require('config');
let tool = require("./tool")



//database connection
mongoose.Promise = global.Promise;
const options = {
  autoIndex: false, // Dùng để kiểm soát việc tự động tạo chỉ mục.
  useNewUrlParser: true, // Sử dụng bộ phân tích cú pháp URL mới để xử lý kết nối MongoDB.
  useUnifiedTopology: true // Sử dụng cơ chế topology mới để xử lý kết nối.
};

mongoose.connect(config.get('mongodb.connectionString'),options).then(()=>{
    console.log("connected to mongoDB");
    // tool.createadmin();
}).catch((err)=>{
    console.log("Error connecting to database",err);
})


module.exports=mongoose;