/*

 */

'use strict'

if(process.env.NODE_ENV.trim()=='dev')
{
	// console.log('开发环境');
	require('./src/app.js');
}
else{
	// console.log('生成环境');
	require('./dist/app.js');
}



