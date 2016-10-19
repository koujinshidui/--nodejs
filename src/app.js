/*
  express服务器文件

 */

'use strict'
  
let PORT  =process.env.PORT;

const express = require('express');
const orm  =require('orm');



let app = express();


const bodyParser = require('body-parser')
app.use(bodyParser()); 


const session = require('express-session');
app.use(session({
  secret: 'cz02', 
  resave: false,
  saveUninitialized: true
}));


app.use(orm.express("mysql://root:@127.0.0.1:3306/nodesystem", {
    define: function (db, models, next) {


        let modelObj =  require('./model/initModels.js');
        modelObj(db,models);

        next();
    }
}));


let xtpl = require('xtpl');
app.set('views',__dirname+'/views'); 
app.set('view engine', 'html'); 

app.engine('html',xtpl.renderFile);


app.use(express.static(__dirname+'/statics'));

let accountRoute = require('./routes/accountRoute.js');
let adminRoute = require('./routes/adminRoute.js');

app.all('/account/*',(req,res,next)=>{
	res.setHeader('Content-Type','text/html;charset=utf8');
	next();
});
 
app.all('/admin/*',(req,res,next)=>{
	res.setHeader('Content-Type','text/html;charset=utf8');

	// if(!req.session.logined)
	// {
	// 	res.end('<script>alert("您未登录");window.location="/account/login";</script>');
	// 	return;
	// }

	next();
});

app.use('/account',accountRoute);
app.use('/admin',adminRoute);


app.all('/api/*',(req,res,next)=>{

	res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    
	next();
});

const apiRoute = require('./routes/apiRoute.js');
app.use('/api',apiRoute);

const ueditor = require("ueditor");
const path = require('path');

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'statics'), function (req, res, next) {

    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/images/ueditor/';
        res.ue_up(img_url);
        res.setHeader('Content-Type', 'text/html');
    }

    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url);
    }
 
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
   
        res.redirect('/ueditor/nodejs/config.json');
    }
}));


app.listen(PORT,()=>{

	console.log('环境已经启动'+PORT);
});

