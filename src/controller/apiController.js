'use strict'

//给app中的index.html页面中的ajax提供数据的
exports.getvideos = (req,res)=>{
	//设置允许跨域请求
	//res.header() 等价于res.setHeader()
	//缺点：如果这到这里，只要是属于api下面的方法都要写一次，这时候
	//可以考虑将这三句代码写到 app.js中的 app.all('/api/*')里面
	// res.header("Access-Control-Allow-Origin", "*");  
 //    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
 //    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
console.log(11111111);
	let resObj = {status:0,message:''};

	//1.0 注意点：这个地方由于videinfo中没有图片的字段，所以此处写死这个图片的路径
	// select vid,vimg,vtitle,vsummary from videoinfo
	req.models.videoinfo.find({vstatus:0},(err,datas)=>{
		if(err)
		{
			resObj.status = 1;//失败的状态
			resObj.message = err.message;

			res.end(JSON.stringify(resObj));
			return;
		}

		//成功的返回
		resObj.message = datas;
		/*
			json是什么样的：
			resObj：{status:0,message:[
				{img:'',vid:,vtitle:,vsortno:,vvideoid:,vsummary:,vremark:},
				{}
			]}

		 */
		res.end(JSON.stringify(resObj));
	});
}


//2.0 获取单跳视频数据
exports.getvideobyvid =(req,res)=>{

//1.0 获取vid的值
let vid = req.params.vid;

//2.0 参数合法性检查

//3.0 按需查询数据库数据(为ajax请求提供数据)
let sql = 'select vvideoid,vremark from videoinfo where vid='+vid;
let resObj  ={status:0,message:''};
req.db.driver.execQuery(sql,(err,datas)=>{
	if(err)
	{
		resObj.status = 1;
		resObj.messsage=err.message;
		res.end(JSON.stringify(resObj));
		return;
	}

	//正常数据的返回
	resObj.message = datas;
	res.end(JSON.stringify(resObj));
});

}
