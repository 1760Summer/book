<!--新增/修改作品-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar :title="title" :autoBack="true" :placeholder="true"bgColor=""></u-navbar>
		<!--表单-->
		<view class="subPanel">
			<u-form labelPosition="left" labelWidth="100":model="book" :rules="rules" ref="aubook">
				<u-form-item label="作品名称" labelWidth="100" prop="book_name" ref="book_name">
					<u-input v-model="book.book_name"></u-input>
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="SaveBook">保存</u-button>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				_id: '',
				title: '',
				type: '',
				book:{
					book_name: ''
				},
				rules: {
					'book_name': {
						type: 'string',
						required: true,
						message: '请填写作品名称',
						trigger: ['blur', 'change']
					},
				},
				errorType: 'message',
			}
		},
		onLoad(option){
			if(option._id==null){
				this.type = "add",
				this.title = "新建作品"
			}else{
				this._id = option._id
				this.type = "upd"
				this.title = "修改作品"
				//根据_id获取作品信息
				this.GetBookById()
			}
		},
		methods:{
			//获取作品信息
			GetBookById(){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyid',
						_id: this._id
					}
				}).then(res=>{
					this.book = res.result.data[0]
				})
			},
			//保存作品
			SaveBook(){
				//进行校验
				this.$refs.aubook.validate().then(res=>{
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
				if(this.type=="add"){
					uniCloud.callFunction({
						name:'Book',
						data:{
							type: this.type,
							book: this.book
						}
					}).then(res=>{
						console.log(res)
						uni.showToast({
							title: '新增成功！',
							icon: 'success'
						})
					})
				}else if(this.type=="upd"){
					console.log(this.book)
					uniCloud.callFunction({
						name:'Book',
						data:{
							type: this.type,
							_id: this._id,
							book: this.book
						}
					}).then(res=>{
						console.log(res)
						uni.showToast({
							title: '修改成功！',
							icon: 'success'
						})
					})
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.subPanel {
		margin: auto;
		width: 90%;
	}
</style>