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
		case "selSubArt"://查询分卷与章节的上下结构
		    try{
		    	const res = await db.collection('Article')
		    	.where({book_id:event._id})
		    	.orderBy('article_ctime asc')
		    	.get({getTree: {startWith:"article_type!='R'&&(parent_id==null||parent_id==undefined||parent_id=='')"}})
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selart"://根据book_id只取章节
		    try{
		    	const res = await db.collection('Article')
		    	.where({book_id:event._id,article_type:'A'})
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selrel"://根据book_id只取相关
		    try{
		    	const res = await db.collection('Article')
		    	.where({book_id:event._id,article_type:'R'})
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selbyid"://根据book_id查询分卷/章节（content）
		    try{
		    	const res = await db.collection('Article')
		    	.where({_id:event._id})
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "add"://新建分卷/章节
		    try{
		    	var now = vk.pubfn.getFullTime(new Date())
		    	event.article.article_ctime = now;//创建时间赋值
		    	const res = await db.collection('Article')
		    	.add(event.article)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "upd"://修改内容
		    try{
		    	var now = vk.pubfn.getFullTime(new Date())
		    	event.article.sys_time = now;//修改时间赋值
		    	const res = await db.collection('Article')
		    	.doc(event._id)
		    	.update(event.article)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "del"://删除章节(不要纠结联动删除了，现在做不到)
		    try{
		    	const res = await db.collection('Article')
		    	.doc(event._id)
		    	.remove()
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
