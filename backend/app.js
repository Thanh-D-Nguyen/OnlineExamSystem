const PORT = process.env.PORT || 4000
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const helmet = require('helmet')
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
var passport = require("./services/passportconf");
var tool = require("./services/tool");
const cors = require('cors');
var app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin', 'access-control-allow-credentials'],
    credentials: true
}));

app.use(helmet());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin, access-control-allow-credentials");
//     next();
// });

app.use(express.json());
//import other files
var mongoose = require("./services/connection");
var admin = require("./routes/admin");
var login = require("./routes/login");
var user = require("./routes/user");
var universal = require("./routes/universal");
var question = require("./routes/questions");
var testpaper = require("./routes/testpaper");
var up = require("./routes/fileUpload");
var trainee = require("./routes/trainee");
var stopRegistration = require("./routes/stopRegistration");
var results = require("./routes/results");
var dummy = require("./routes/dummy");
const { config } = require('process');
const conf = require('./config/default.json');


//configs
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: conf.jwt.secret, // Thay 'your-secret-key' bằng một chuỗi bí mật mạnh mẽ
    resave: false,
    saveUninitialized: false
  }));

//passport
app.use(passport.initialize());
app.use(passport.session());


//bind routes
app.use("/api/v1/admin",passport.authenticate('user-token', { session : false }),admin);
app.use("/api/v1/user",passport.authenticate('user-token', { session : false }),user);
app.use('/api/v1/subject',passport.authenticate('user-token', { session : false }),universal);
app.use('/api/v1/questions',passport.authenticate('user-token', { session : false }),question);
app.use('/api/v1/test',passport.authenticate('user-token', { session : false }),testpaper);
app.use('/api/v1/upload',passport.authenticate('user-token', { session : false }),up);
app.use('/api/v1/trainer',passport.authenticate('user-token', { session : false }),stopRegistration);
app.use('/api/v1/trainee',trainee);
app.use('/api/v1/final',results);
app.use('/api/v1/lala',dummy);



app.use('/api/v1/login',login);

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

//error handlings
app.use(function(req, res, next) {
    next(createError(404,"Invalid API. Use the official documentation to get the list of valid APIS."));
});

app.use((err, req, res, next)=>{
    console.log("Lỗi: ", err.PORT, err.message);
    const statusCode = err.status || 500; // Sử dụng 500 nếu không có mã trạng thái được thiết lập

    res.status(statusCode).json({
        success : false,
        message : err.message
    });
});

app.listen(PORT,(err)=>{
    if(err){
        console.log(err);
    }
    console.log(`Server Started. Server listening to port ${PORT}`);
});