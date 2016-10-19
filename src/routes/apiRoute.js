'use strict'

const express = require('express');
const apiCtrl = require('../controller/apiController.js');

let route = express.Router();

//1.0 移动app要访问的路由
route.get('/getvideos',apiCtrl.getvideos);

//2.0 获取某个id对应的视频数据
route.get('/getvideo/:vid',apiCtrl.getvideobyvid);

module.exports = route;
