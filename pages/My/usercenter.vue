<!--用戶中心-->
<template>
	<view style="background-color: gainsboro;height: 100%;">
		<!--导航栏-->
		<u-navbar title="用户中心" leftIcon="" :placeholder="true" bgColor=""></u-navbar>
		<!--用户-->
		<view style="padding: 10px 20px;height: 130px;background-color: white;overflow: hidden; border-radius: 0 0 30% 30%;">
			<u-cell-group :border="false" >
				<u-cell :icon=icon :iconStyle="{'width':'50px','height':'50px','border-radius':'100%'}"
				:border="false" :title=title :titleStyle="{'margin-left':'10px'}" @click="DetailOrLogin" isLink></u-cell>
			</u-cell-group>
			<view style="background-color: #EEEEEE; margin-left: 50px;margin-top: 10px;">
				<view class="transverse">
					<span>{{list.book}}</span>
					<span>作品数</span>
				</view>
				<view class="transverse">
					<span>{{list.art}}</span>
					<span>章节数</span>
				</view>
				<view class="transverse">
					<span>{{list.num}}</span>
					<span>总字数</span>
				</view>
			</view>
		</view>
		<!--功能列表-->
		<view style="padding: 20px;">
			<u-cell-group :border="false" :customStyle="{'background-color':'white','border-radius':'5%'}">
				<u-cell :border="false" title="主题色" :titleStyle="{'margin-left':'10px'}" ></u-cell>
				<u-cell :border="false" title="应用锁" :titleStyle="{'margin-left':'10px'}" ></u-cell>
				<u-cell :border="false" title="夜间模式" :titleStyle="{'margin-left':'10px'}" ></u-cell>
				<u-cell :border="false" title="横屏模式" :titleStyle="{'margin-left':'10px'}" ></u-cell>
			</u-cell-group>
		</view>
		<view style="padding: 20px;">
			<u-cell-group :border="false" :customStyle="{'background-color':'white','border-radius':'5%'}">
				<u-cell :border="false" title="同步备份" :titleStyle="{'margin-left':'10px'}" ></u-cell>
				<u-cell :border="false" title="好评鼓励" :titleStyle="{'margin-left':'10px'}" ></u-cell>
				<u-cell :border="false" title="关于我们" :titleStyle="{'margin-left':'10px'}" ></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	export default{
		data(){
			return{
				icon: '',
				title: '',
				list: []
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onShow() {
			this.IsLogin()
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['UserLogin','UserLogout']),
			//判断是否已登陆
			IsLogin(){
				var _self = this;
				if(this.hasLogin){
					this.icon=this.userInfo.user_picture
					this.title=this.userInfo.user_name
					this.GetMyALLCreated()
				}else{
					this.icon="/static/img/user.png";
					this.title="未登录"
					this.list.book = 0
					this.list.art = 0
					this.list.num = 0
				}
			},
			//登录或详细信息
			DetailOrLogin(){
				if(this.hasLogin){
					uni.navigateTo({
						url: '/pages/My/userinformation'
					});
				}else{
					uni.navigateTo({
						url: '/pages/My/login'
					});
				}
			},
			GetMyALLCreated(){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyauthor',
						book_author: this.userInfo._id
					}
				}).then(res=>{
					this.list = res.result.data
					//统计作品数、章节数、总字数
					var count1=0;var count2=0;
					for(var i=0;i<this.list.length;i++){
						for(var j=0;j<this.list[i]._id.Article.length;j++){
							if(this.list[i]._id.Article[j].parent_id!=null&&this.list[i]._id.Article[j].parent_id!=""&&this.list[i]._id.Article[j].parent_id!=undefined){//章节
							    count1 ++;
								count2 += this.list[i]._id.Article[j].article_number
							}
						}
					}
					this.list.book = this.list.length
					this.list.art = count1
					this.list.num = count2
				})
			}
		}
	}
</script>

<style>
	.transverse{
		display: flex;
		align-items: center;
	    flex-direction: column;
		float: left;
		font-size: 14px;
		margin-right: 50px;
	}
</style>