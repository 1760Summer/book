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
	var type = event.type;
	switch (type){
		case "sel"://查询全部作品（无关联）
		    try{
		    	const res = await db.collection('Book').get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selbyid"://根据book_id查询作品(不含章节)
		    try{
		    	const book = db.collection('Book').where({_id:event._id}).getTemp()
		    	const user = db.collection('User').where({_id:book.book_author}).getTemp()
		    	const res = await db.collection(book,user)
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selbyauthor"://根据book_author查询作品
		    try{
		    	const book = db.collection('Book').where({book_author:event.book_author}).getTemp()
		    	const article = db.collection('Article').where("article_type!='R'").getTemp()
		    	const user = db.collection('User').where({_id:event.book_author}).getTemp()
		    	const res = await db.collection(book,user,article)
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selbyidcount"://根据book_id查询作品
		    try{
		    	const book = db.collection('Book').where({_id:event._id}).getTemp()
		    	const article = db.collection('Article').where("article_type!='R'").getTemp()
		    	const user = db.collection('User').where({_id:book.book_author}).getTemp()
		    	const res = await db.collection(book,user,article)
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "selbyname"://根据book_name查询作品（没必要关联章节，改！！！）
		    try{
		    	const book = db.collection('Book').where(`${new RegExp(event.book_name, 'i')}.test(book_name)`).getTemp()
		    	const article = db.collection('Article').where("article_type!='R'").getTemp()
		    	const user = db.collection('User').where({_id:event.book_author}).getTemp()
		    	const res = await db.collection(book,user,article)
		    	.get()
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "add"://新增作品
		    try{
		    	var now = vk.pubfn.getFullTime(new Date())
		    	event.book.book_ctime = now;//创建时间赋值
		    	const res = await db.collection('Book')
		    	.add(event.book)
		    	return res
		    }catch(e){
		    	console.log(e)
		    }
			break;
		case "upd"://修改作品
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
			break;
		case "del"://删除作品
		    try{
		    	const res = await db.collection('Book')
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
