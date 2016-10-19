'use strict'

const express =require('express');
const adminCtrl = require('../controller/adminController.js');

let route = express.Router();

//1.0 route添加路由字符串
route.all('/list',adminCtrl.getlist);///:count/:index

//2.0 添加add相关路由
route.get('/add',adminCtrl.getadd)
route.post('/add',adminCtrl.postadd);

//2.0 添加edit相关路由
route.get('/editvideo/:vid',adminCtrl.getedit)
route.post('/editvideo',adminCtrl.postedit);

//3.0 删除数据
route.get('/delvideo/:vid',adminCtrl.getdelvideo);

//暴露route
module.exports = route;
