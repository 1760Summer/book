'use strict';
//创建连接(jql写法)
var db = uniCloud.databaseForJQL()//jql操作
//公共模块
const vk = {
	pubfn : require('vk-unicloud-api-time')
}
exports.main = async (event, context) => {
	var type = event.type;
	switch (type){
		case "sel"://查询全部标签
		    try{
		    	const res = await db.collection('Span').get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		default:
			console.log("方法名不对，请检查！")
			break;
	}
};
