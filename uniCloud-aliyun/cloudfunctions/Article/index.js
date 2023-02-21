'use strict';
//创建连接(jql写法)
var db = uniCloud.databaseForJQL()
//公共模块
const vk = {
	pubfn : require('vk-unicloud-api-time')
}
exports.main = async (event, context) => {
	if(event.type=="selSubArt"){
		//查询分卷与章节的上下结构
		try{
			const res = await db.collection('Article')
			.where({book_id:event._id})
			.orderBy(' _id desc')
			.get({getTree: true})
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="selbyid"){
		//根据id查询分卷/章节
		try{
			const res = await db.collection('Article').doc(event._id).get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="add"){
		//新建分卷/章节
		try{
			const res = await db.collection('Article')
			.add(event.article)
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="upd"){
		//修改内容
		try{
			const res = await db.collection('Article')
			.doc(event._id)
			.update(event.article)
			return res
		}catch(e){
			console.log(e)
		}
	}
};
