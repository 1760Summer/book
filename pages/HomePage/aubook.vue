<!--新增/修改作品-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar :title="title" :autoBack="true" :placeholder="true" bgColor=""></u-navbar>
		<!--表单-->
		<view class="subPanel">
			<u-form labelPosition="left" labelWidth="100":model="book" :rules="rules" ref="aubook">
				<u-form-item label="封面" labelWidth="60" prop="book_picture" ref="book_picture">
					<u-image :showLoading="true" :src="book.book_picture" width="80px" height="80px" @click="Upload"></u-image>
				</u-form-item>
				<u-form-item label="书名" labelWidth="60" prop="book_name" ref="book_name">
					<u-input v-model="book.book_name"></u-input>
				</u-form-item>
				<u-form-item label="标签" labelWidth="60" prop="book_span" ref="book_span">
					<u-checkbox-group v-model="book.book_span" placement="row" @change="checkboxChange" 
					style="width: 100%;display: flex; flex-wrap: wrap; justify-content: space-between;">
						<u-checkbox style="margin: 5px; width: 20%;"
						v-for="(item, index) in checkboxList" :key="index":label="item.name":name="item.value">
						</u-checkbox>
					</u-checkbox-group>
					<!-- <u-input v-model="book.book_span"></u-input> -->
				</u-form-item>
			</u-form>
			<u-button type="primary" @click="Check">保存</u-button>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import DelPicture from "../../common/util.js"
	export default{
		data(){
			return{
				_id: '',
				title: '',
				type: '',
				book:{
					book_picture: '',
					book_name: '',
					book_author: '',
					book_span: []
				},
				checkboxList:[],
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
		computed: {
			...mapState(['hasLogin', 'userInfo'])
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
			this.GetSpan();
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
					delete this.book._id//删除属性_id，修改不能带_id
				})
			},
			//进行校验
			Check(){
				this.$refs.aubook.validate().then(res=>{
					uni.$u.toast('校验通过')
					this.SaveBook()
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			//保存作品
			SaveBook(){
				this.book.book_author = this.userInfo._id
				if(this.type=="add"){
					uniCloud.callFunction({
						name:'Book',
						data:{
							type: this.type,
							book: this.book
						}
					}).then(res=>{
						uni.showToast({
							title: '新增成功！',
							icon: 'success'
						})
						uni.switchTab({
							url: '/pages/HomePage/bookshelf',
							success:function(e){
								var page = getCurrentPages()[0];
								if(page == undefined || page == null) return;
								page.$vm.GetMyCreated();
							}
						});
					})
				}else if(this.type=="upd"){
					uniCloud.callFunction({
						name:'Book',
						data:{
							type: this.type,
							_id: this._id,
							book: this.book
						}
					}).then(res=>{
						uni.showToast({
							title: '修改成功！',
							icon: 'success'
						});
						uni.switchTab({
							url: '/pages/HomePage/bookshelf',
							success:function(e){
								var page = getCurrentPages()[0];
								if(page == undefined || page == null) return;
								page.$vm.GetMyCreated();
							}
						});
					})
				}
			},
			//上传图片
			Upload() {
				var _self=this
				uni.chooseImage({
					count: 1,
					success(res) {
						if(res.tempFilePaths.length>0){
							let filePath = res.tempFilePaths[0]
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: Date.now()+'.jpg',
								success(res){
									//有图片时先删除之前的图片
									if(_self.book.book_picture!=null&&_self.book.book_picture!=''&&_self.book.book_picture!=undefined){
									    DelPicture.DelPicture('Book',_self.book.book_picture)	
									}
									_self.book.book_picture = res.fileID
								}
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			//获取标签
			GetSpan(){
				uniCloud.callFunction({
					name: 'Span',
					data: {
						type: 'sel'
					}
				}).then(res=>{
					for(var i=0;i<res.result.data.length;i++){
						this.checkboxList.push({name:res.result.data[i].span_name,value:res.result.data[i]._id})
					}
				})
			},
			//多选标签
			checkboxChange(e) {
				if(e.length>3){
					e.pop();
					uni.showModal({
						title: "通知：",
						content: "最多只能选择三个标签！",
						showCancel: false
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