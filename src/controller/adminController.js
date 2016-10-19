//1.0 admin/list列表的get请求
'use strict'
exports.getlist = (req,res)=>{
	let count = req.params.count;
	let index = req.params.index;

	let offsetValue = (index -1)*count;

	//获取数据库表videoinfo的总条数
	let pageArr =[];
	//select count(*) from videoinfo
	req.models.videoinfo.count({},(err,data)=>{
		let rowcount = data / count;  //计算总页数
		rowcount = rowcount<1?1: Math.ceil(rowcount);

		for (let i = 1; i<=rowcount ; i++) {
			pageArr.push(i);
		};
		
	});
// res.models.videoinfo.find()

	//0.0 获取提交过来的查询条件数据
	//由于这个方法接受两个请求，当时当get请求的时候titleVal是没有值的
	let titleVal = req.body.vtitle; 
	let queryValue = '';
	let where={vstatus:0};  //正常数据
	if(titleVal)
	{
		//想要实现like匹配很难做到，但是可以利用global来解决问题 
		// where = {vtitle:global.orm.like('%'+titleVal+'%')}; 
		// where = {vtitle:titleVal}; 
		where.vtitle = titleVal;

		queryValue = titleVal;
	}

	//1.0 读取db中的videoinfo表中的所有数据
	req.models.videoinfo.find(where,{offset:offsetValue,limit:count},(err,list)=>{
		//2.0 判断数据是否报错
		if(err)
		{
			res.end(err);
			return;
		}
//
//]
//
		//3.0 将页面渲染以后响应给浏览器
		res.render('admin/videolist.html',{array:list,titleVal:queryValue},(err,html)=>{//,pagearr:pageArr

		res.end(html);
		});

	});
}

//sql语句版本
// exports.getlist = (req,res)=>{
// 	//0.0 获取提交过来的查询条件数据
// 	//由于这个方法接受两个请求，当时当get请求的时候titleVal是没有值的
// 	let titleVal = req.body.vtitle; 
// 	let sql = 'select * from videoinfo ';
// 	let queryValue = '';
// 	if(titleVal)
// 	{
// 		sql+=" where vtitle like '%"+titleVal+"%' ";
// 		queryValue = titleVal;
// 	}
// 	req.db.driver.execQuery(sql,(err,list)=>{

// 		//2.0 判断数据是否报错
// 		if(err)
// 		{
// 			res.end(err);
// 			return;
// 		}

// 		//3.0 将页面渲染以后响应给浏览器
// 		res.render('admin/videolist.html',{array:list,titleVal:queryValue},(err,html)=>{

// 		res.end(html);
// 		});
// 	});
// }

//2.0 新增逻辑
//2.0.1 将新增页面响应
exports.getadd=(req,res)=>{



	res.render('admin/videoadd.html',{},(err,html)=>{
	if(err)
	{
		res.end(err);
		return;
	}

	res.end(html);

	});
}
//负责将数据插入到表videoinfo中
exports.postadd=(req,res)=>{
	//1.0 获取浏览器请求body中的所有值
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;

	//2.0 将值入库
	req.models.videoinfo.create({
			vtitle:vtitle,
        	 vsortno:vsortno,
        	 vsummary:vsummary,
             vremark:vremark,
             vstatus :0,
             vvideoid:vvideoid
	},(err,item)=>{
		if(err)
		{
			res.end(err);
			return;
		}

		//3.0 响应浏览器
		res.end("<script>alert('新增成功');window.location='/admin/list';</script>");

	});

}
//4.0 职责：根据数据id值获取数据库的这条数据生成到页面上返回
exports.getedit=(req,res)=>{

	//1.0 获取vid的值
	let vid = req.params.vid;

	//2.0 根据vid找到数据
	req.models.videoinfo.get(vid,(err,item)=>{
		console.log(item);
		//item的格式：{vid:,vtitle,vsortno,.....}
		res.render('admin/videoedit.html',item,(err,html)=>{
			if(err)
			{
				res.end(err);
				return;
			}
			res.end(html);

		})
	});

}

//接受浏览器发过来的数据更新vid对应的数据库记录中每个字段的值
exports.postedit=(req,res)=>{
//1.0 获取body中的值
	let vid = req.body.vid;
	let vtitle = req.body.vtitle;
	let vsortno = req.body.vsortno;
	let vsummary = req.body.vsummary;
	let vvideoid = req.body.vvideoid;
	let vremark = req.body.editorValue;

//2.0 查询出需要更新的这条数据
req.models.videoinfo.get(vid,(err,item)=>{
	//3.0 修改值
	item.vtitle = vtitle;
	item.vsortno = vsortno;
	item.vsummary = vsummary;
	item.vvideoid = vvideoid;
	item.vremark = vremark;

	item.save((error)=>{
		if(error)
		{
			res.end(error);
			return;
		}
		res.end("<script>alert('数据更新成功');window.location='/admin/list';</script>");

	});

})

}

//删除视频数据（这个方法专门处理的是ajax的请求，所以响应回去的是json字符串）
exports.getdelvideo=(req,res)=>{
//1.0 获取vid
let vid = req.params.vid;
let resObj = {status:0,message:''};

//2.0 删除数据
// update videoinfo set vstatus = 1 wehre vid = 3 //软删除
req.db.driver.execQuery('delete from videoinfo where vid='+vid,(err)=>{
	 if(err)
	 {
	 	resObj.status = 1;
	 	resObj.message='删除失败';
	 	res.end(JSON.stringify(resObj));
	 	return;
	 }

	resObj.message="数据删除成功";
	 res.end(JSON.stringify(resObj));
});

}
