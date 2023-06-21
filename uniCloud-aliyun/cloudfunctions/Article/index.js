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
			.where({book_id:event._id}&&"article_type!='R'")
			.orderBy('article_ctime asc')
			.get({getTree: true})
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="selrel"){
		//根据id查相关
		try{
			const res = await db.collection('Article')
			.where({book_id:event._id}&&"article_type=='R'")
			.get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="selbyid"){
		//根据id查询分卷/章节（content）
		try{
			const res = await db.collection('Article')
			.where({_id:event._id})
			.get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="add"){
		//新建分卷/章节
		try{
			var now = vk.pubfn.getFullTime(new Date())
			event.article.article_ctime = now;//创建时间赋值
			const res = await db.collection('Article')
			.add(event.article)
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="upd"){
		//修改内容
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
	}else if(event.type=="del"){
		//删除章节(不要纠结联动删除了，现在做不到)
		try{
			const res = await db.collection('Article')
			.doc(event._id)
			.remove()
			return res
		}catch(e){
			console.log(e)
		}
	}
};
