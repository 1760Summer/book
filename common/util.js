//删除云储存的图片
function DelPicture(name,picture) {
	uniCloud.callFunction({
		name: name,
		data:{
			type: 'delpicture',
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