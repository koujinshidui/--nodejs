/**
 * 负责处理account相关的所有逻辑
 */

'use strict'
//负责get请求，将注册页面响应给浏览器
exports.getregister = (req,res)=>{
	//负责将account/register.html模板页面中的内容响应给浏览器
	res.render('account/register.html',{},(err,html)=>{
		res.end(html);
	});
}

//负责得到注册页面上的表单数据，将数据插入到userinfo表中
exports.postregister = (req,res)=>{

	console.log(req.body);
	//1.0 获取通过浏览器提交上来的数据
	let vname = req.body.vname;
	let vpwd = req.body.vpwd; //明文
	vpwd = require('../tools/md5entry.js')(vpwd); //将明文加密成MD5密文
	let vqq = req.body.vqq;
	let vemail = req.body.vemail;

	//1.0.1 参数合法性检查

	//2.0 将这些数据通过req.models.userinfo插入到表userinfo中
	//注意：字段名称一定是和数据库的字段名称保持一致
	req.models.userinfo.create({
		uname:vname,
		upwd:vpwd,
		uqq:vqq,
		uemail:vemail
	},(err,user)=>{

	//3.0 提醒用户注册成功，同时跳转到登录页面
	// res.setHeader('Content-Type','text/html;charset=utf8');
	res.end('<script>alert("注册成功");window.location="/account/login"</script>');

	});
	
}


//登录逻辑
//getlogin:用来获取login.html这个页面响应给浏览器
exports.getlogin = (req,res)=>{
	res.render('account/login.html',{},(err,html)=>{
		//在这里我们的charset=utf8已经在app.js中的通过/admin/*这种通配符路径进行提前设置
		//所以我们在此处不需要再设置
		res.end(html);
	});
}

//接收浏览器发送过来的请求数据，将数据发送到mysql数据库中进行查询
//如果有查找数据则表示处理登陆成功的逻辑
exports.postlogin = (req,res)=>{

	//1.0 获取浏览器提交上来的值
	let uname =req.body.uname;
	let upwd = req.body.upwd;  //明文
	let vcode = req.body.vcode;

	//2.0 将vcode与服务器session中的字符串比对
	let vcodeFormSession = req.session.vcode;
	if(vcode !=vcodeFormSession )
	{	
		res.end('<script>alert("验证码错误");window.location="/account/login";</script>');
		return;
	}

	//3.0 验证用户名和密码的正确性
	//3.0.1 将明文密码加密成MD5的密文
	upwd = require('../tools/md5entry.js')(upwd);
	//3.0.2 查询数据表userinfo的数据，条件是: uname和upwd
	req.models.userinfo.find({uname:uname,upwd:upwd},(err,users)=>{

		//当users数组有值，则表示用户名和密码正确
		if(users.length == 0)
		{	
			res.end('<script>alert("用户名或者密码错误");window.location="/account/login";</script>');
			return;
		}

		//4.0 将属于当前浏览器的session对象添加一个logined属性值存储为uname这个变量的值
		req.session.logined = uname;  //这个标记将来在所有的请求中都要去判断

		//5.0 响应给浏览器
		res.end('<script>alert("用户登录成功");window.location="/admin/list";</script>');
	});
}

// 生成一个验证码的图片
exports.getvcode = (req,res)=>{
	//1.0 产生一个随机字符串当做验证码,将验证码字符串保存到session中	
	//2.0 将验证码变成一个图片	
	//3.0 将图片响应回浏览器
	
	let vcode = parseInt(Math.random()*9000+1000);

	//0.0 将vcode存储到session中 (express-session)
	//将vcode字符串存储到术语当前浏览器的session对象中
	req.session.vcode = vcode.toString();
	
	let captchapng = require('captchapng');

	let p = new captchapng(80,30,vcode); // width,height,numeric captcha 
    p.color(128, 23,90, 255);  // First color: background (red, green, blue, alpha) 
    p.color(87, 10, 180, 255); // Second color: paint (red, green, blue, alpha) 

    let img = p.getBase64();
    let imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
	
}
