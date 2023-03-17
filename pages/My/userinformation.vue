<!--用户信息-->
<template>
	<view style="background-color: gainsboro;height: 100%;">
		<!--导航栏-->
		<u-navbar title="用户信息" :autoBack="true" :placeholder="true" bgColor=""></u-navbar>
		<view style="display: flex;flex-direction: column;align-items: center;background-color: white;margin:10px 0px;padding: 10px;">
			<u-avatar size="60" :src="userInfo.user_picture" @click="UpdateAvatar"></u-avatar>
			<span>点击修改头像</span>
		</view>
		<view style="margin:10px 0px;">
			<u-cell-group :border="false" :customStyle="{'background-color':'white'}">
				<u-cell :border="false" title="昵称" @click="show = true">
					<view slot="value" style="display: flex;align-items: center;">
						<text style="margin: 0 10px;">{{userInfo.user_name}}</text>
						<u-tag text="修改" plain shape="circle" size="mini" @click="show = true"></u-tag>
					</view>
				</u-cell>
				<u-cell :border="false" title="用户ID" :value="userInfo._id"></u-cell>
				<u-cell :border="false" title="注册日期" :value="userInfo.user_ctime"></u-cell>
				<u-cell :border="false" title="注销帐号" isLink @click="DeleteUser"></u-cell>
			</u-cell-group>
		</view>
		<view style="margin:10px 0px;">
			<u-button :plain="true" text="退出登录" :customStyle="{'border':'none','color':'red'}" @click="Logout"></u-button>
		</view>
		<!--修改昵称弹窗-->
		<u-popup :show="show" mode="center" :round="10" @close="Close">
			<view>
				<u-form labelPosition="left" labelWidth="100":model="user" :rules="rules" ref="user">
					<span style="display: block;text-align: center; font-weight: bold;">修改昵称</span>
					<u-form-item prop="user_name" ref="user_name">
						<u-input border="bottom" v-model="user.user_name" placeholder="请输入昵称"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="UpdateName"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="Close"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import DelPicture from "../../common/util.js"
	import {mapState,mapMutations} from 'vuex';
	export default{
		data(){
			return{
				show:false,
				_id: '',
				user: {},
				rules: {
					'user_name': {
						type: 'string',
						required: true,
						message: '请填写昵称',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad() {
			this.GetUser()
		},
		methods: {
			...mapMutations(['UserLogin','UserLogout']),
			//退出登录
			Logout(){
				this.UserLogout()
				uni.switchTab({
					url: '/pages/My/usercenter',
					success:function(e){
						var page = getCurrentPages()[0];
						if(page == undefined || page == null) return;
						page.$vm.IsLogin();
					}
				});
			},
			//注销帐号
			DeleteUser(){
				uni.showModal({
					title: "谨慎操作",
					content: "请确认是否注销该帐号？",
					showCancel: true,
					success:(res)=>{
						if(res.confirm){
							uniCloud.callFunction({
								name:'User',
								data:{
									type: 'del',
									_id: this.userInfo._id
								}
							}).then(res=>{
								this.UserLogout()
								uni.switchTab({
									url: '/pages/My/usercenter',
									success:function(e){
										var page = getCurrentPages()[0];
										if(page == undefined || page == null) return;
										page.$vm.IsLogin();
									}
								});
								uni.showToast({
									title: '注销成功！',
									icon: 'success'
								});
							})
						}
					}
				})
			},
			//获取用户信息
			GetUser(){
				uniCloud.callFunction({
					name:'User',
					data:{
						type: 'login',
						user_tel: this.userInfo.user_tel
					}
				}).then(res=>{
					this.user = res.result.data[0]
					this._id = res.result.data[0]._id
					delete this.user._id//删除属性_id，修改不能带_id
				})
			},
			//修改头像 
			UpdateAvatar(){
				var _self = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						if(res.tempFilePaths.length>0){
							let filePath = res.tempFilePaths[0]
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: Date.now()+'.jpg',
								success(res){
									// //有图片时先删除之前的图片
									if(_self.user.user_picture!=null&&_self.user.user_picture!=''&&_self.user.user_picture!=undefined){
									    DelPicture.DelPicture('User',_self.user.user_picture)	
									}
									_self.user.user_picture = res.fileID
									uniCloud.callFunction({
										name:'User',
										data:{
											type: 'upd',
											_id: _self._id,
											user: _self.user
										}
									}).then(res=>{
										//修改并重新获取缓存
										_self.user._id = _self._id
										uni.setStorageSync('userInfo',_self.user);
										uni.getStorage({
											key: 'userInfo',
											success(res) {
												if(res.data.user_tel){
													_self.UserLogin(res.data)
												}
											}
										})
										uni.showToast({
											title: '修改成功！',
											icon: 'none'
										})
									})
								}
							})
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			//修改昵称
			UpdateName(){
				var _self = this;
				_self.show = false;
				uniCloud.callFunction({
					name:'User',
					data:{
						type: 'upd',
						_id: _self._id,
						user: _self.user
					}
				}).then(res=>{
					//修改并重新获取缓存
					_self.user._id = _self._id
					uni.setStorageSync('userInfo',_self.user);
					uni.getStorage({
						key: 'userInfo',
						success(res) {
							if(res.data.user_tel){
								_self.UserLogin(res.data)
							}
						}
					})
					uni.showToast({
						title: '修改成功！',
						icon: 'none'
					})
				})
			},
			//关闭修改昵称弹窗
			Close(){
				this.show = false;
			}
		}
	}
</script>

<style>
</style>