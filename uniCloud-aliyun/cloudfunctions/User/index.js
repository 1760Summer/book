'use strict';
//创建连接(jql写法)
var db = uniCloud.databaseForJQL()
//公共模块
const vk = {
	pubfn : require('vk-unicloud-api-time')
}
exports.main = async (event, context) => {
	var type = event.type;
	switch (type){
		case "login"://查询是否存在
		    try{
		    	const res = await db.collection('User')
		    	.where({user_tel:event.user_tel})
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "logon"://用户名密码是否匹配
		    try{
		    	const res = await db.collection('User')
		    	.where({user_tel:event.user_tel}&&{user_password:event.user_password})
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "add"://注册用户
		    try{
		    	var now = vk.pubfn.getFullTime(new Date())
		    	event.user.user_ctime = now;//创建时间赋值
		    	const res = await db.collection('User')
		    	.add(event.user)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "upd"://修改用户
		    try{
		    	var now = vk.pubfn.getFullTime(new Date())
		    	event.user.sys_time = now;//修改时间赋值
		    	const res = await db.collection('User')
		    	.doc(event._id)
		    	.update(event.user)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "updpassword"://修改密码
		    try{
		    	const res = await db.collection('User')
		    	.where({user_tel:event.user.user_tel})
		    	.update(event.user)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "del"://注销用户
		    try{
		    	const res = await db.collection('User')
		    	.doc(event._id)
		    	.remove()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "delpicture"://删除云储存图片
		    try{
		    	const res = await uniCloud.deleteFile({
		    		fileList: [event.fileID]
		    	})
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
