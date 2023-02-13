//删除云储存的图片
function DelPicture(func,type,picture) {
	uniCloud.callFunction({
		name: func,
		data:{
			type: type,
			fileID: picture,
		},
		success: (res) => {
			console.log(res)
		},
		fail() {
			
		}
	})
}
module.exports = {
	DelPicture: DelPicture,
}