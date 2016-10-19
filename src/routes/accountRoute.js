'use strict'

const express =require('express');

//0.0 将accountController.js导入
let accountCtrl = require('../controller/accountController.js');

let route = express.Router();

//1.0 route添加路由字符串
//1.0.1 登录

//1.0.2 注册
//进入注册页面是get请求
//提交表单是post请求
route.get('/register',accountCtrl.getregister);
route.post('/register',accountCtrl.postregister);

//1.0.3 登录
route.get('/login',accountCtrl.getlogin);
route.post('/login',accountCtrl.postlogin);
route.get('/vcode',accountCtrl.getvcode);

//暴露route
module.exports = route;
