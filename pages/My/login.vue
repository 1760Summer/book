<!--注册/登录界面-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar title="用户登录" :autoBack="true" :placeholder="true" bgColor=""></u-navbar>
		<!--表单-->
		<view class="subPanel">
			<u-form labelPosition="left" labelWidth="100":model="user" :rules="rules" ref="login">
				<u-form-item label="手机号" labelWidth="100" prop="user_tel" ref="user_tel">
					<u-input v-model="user.user_tel"></u-input>
				</u-form-item>
				<u-form-item label="密码" labelWidth="100" prop="user_password" ref="user_password">
					<u-input v-model="user.user_password" :password="true"></u-input>
				</u-form-item>
			</u-form>
			<view style="float: left;font-size: 12px;color: royalblue;">若用户不存在则自动注册</view>
			<view style="float: right;font-size: 12px;color: royalblue;" @click="UpdatePassword">忘记密码</view>
			<u-button type="primary" @click="IsLogin">登录</u-button>
		</view>
		<!--修改密码弹窗-->
		<u-popup :show="show" mode="center" :round="10" @close="Close">
			<view>
				<u-form labelPosition="left" labelWidth="100":model="user" :rules="rules" ref="subsection">
					<span style="text-align: center; font-weight: bold;">修改密码</span>
					<u-form-item prop="user_tel" ref="user_tel">
						<u-input border="bottom" v-model="user.user_tel" placeholder="请输入手机号"></u-input>
					</u-form-item>
					<u-form-item prop="user_password" ref="user_password">
						<u-input border="bottom" v-model="user.user_password" placeholder="请输入密码"></u-input>
					</u-form-item>
					<u-form-item prop="password" ref="password">
						<u-input border="bottom" v-model="password" placeholder="请确认密码"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="Check"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="Close"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	export default{
		data(){
			return{
				show: false,
				user:{
					user_tel: '',
					user_password: '',
				},
				password: '',
				islogin:false,
				rules: {
					'user_tel': {
						type: 'string',
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					},
					'user_password': {
						type: 'string',
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					},
					'password': {
						type: 'string',
						required: true,
						message: '请确认密码',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations(['UserLogin']),
			//是否已注册
			IsLogin(){
				uniCloud.callFunction({
					name: 'User',
					data:{
						type: 'login',
						user_tel: this.user.user_tel,
					}
				}).then(res=>{
					if(res.result.data.length>0){//登录
					    this.islogin = true;
						this.Logon()
					}else{//注册
						this.Login()
					}
				})
			},
			//注册
			Login(){
				uniCloud.callFunction({
					name:'User',
					data:{
						type: 'add',
						user: this.user
					}
				}).then(res=>{
					uni.showToast({
						title: '注册成功！',
						icon: 'success'
					})
					this.islogin = true;
					this.Logon()
				})
			},
			//登录
			Logon(){
				let _self = this;
				uniCloud.callFunction({
					name: 'User',
					data:{
						type: 'logon',
						user_tel: this.user.user_tel,
						user_password: this.user.user_password
					}
				}).then(res=>{
					if(res.result.data.length>0){//登录
					    _self.UserLogin(res.result.data[0])
					    uni.switchTab({
					    	url: '/pages/My/usercenter',
							success:function(e){
								var page = getCurrentPages()[0];
								if(page == undefined || page == null) return;
								page.$vm.IsLogin();
							}
					    });
					}else{
						uni.showToast({
							title: '密码错误！',
							icon: 'none'
						})
					}
				})
			},
			//修改密码
			UpdatePassword(){
				console.log(123)
			}
		}
	}
</script>

<style>
	.subPanel {
		margin: auto;
		width: 90%;
	}
</style>