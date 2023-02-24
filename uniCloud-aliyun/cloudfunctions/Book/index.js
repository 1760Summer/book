'use strict';
//创建连接(jql写法)
var db = uniCloud.databaseForJQL()
//公共模块
const vk = {
	pubfn : require('vk-unicloud-api-time')
}
/**
 * 前排注释
 * type : 操作类型
 * condition : 查询条件
 * book : 作品（Book表）json对象
 * _id : 作品（Book表）id*/
exports.main = async (event, context) => {
	//判断类型
	if(event.type=="sel"){
		//查询全部作品
		try{
			const res = await db.collection('Book').get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="selbyauthor"){
		//根据作者查询作品
		try{
			const book = db.collection('Book').where({book_author:event.book_author}).getTemp()
			const res = await db.collection(book,'Article')
			.get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="selbyid"){
		//根据id查询作品
		try{
			const book = db.collection('Book').where({_id:event._id}).getTemp()
			const res = await db.collection(book,'Article')
			.get()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="add"){
		//新增作品
		try{
			var now = vk.pubfn.getFullTime(new Date())
			event.book.book_ctime = now;//创建时间赋值
			const res = await db.collection('Book')
			.add(event.book)
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="upd"){
		//修改作品
		try{
			var now = vk.pubfn.getFullTime(new Date())
			event.book.sys_time = now;//修改时间赋值
			const res = await db.collection('Book')
			.doc(event._id)
			.update(event.book)
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="del"){
		//删除作品
		try{
			const res = await db.collection('Book')
			.doc(event._id)
			.remove()
			return res
		}catch(e){
			console.log(e)
		}
	}else if(event.type=="delpicture"){
		//删除云储存图片
		try{
			const res = await uniCloud.deleteFile({
				fileList: [event.fileID]
			})
			return res
		}catch(e){
			console.log(e)
		}
	}
	//return event;
};
