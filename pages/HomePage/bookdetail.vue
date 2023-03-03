<!--作品详情-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar :title="book.book_name" :autoBack="true" :placeholder="true"bgColor=""></u-navbar>
		<!--作品信息-->
		<view>
			<view>
				<u-cell>
					<u-image slot="icon" :showLoading="true" width="100px" height="120px" 
					:src="book.book_picture"></u-image>
					<view slot="title" class="u-flex-column" style="font-size: 10px;margin-left: 15px;">
						<span>作者：{{book.book_author}}</span>
						<span>标签：{{book.book_name}}</span>
						<span>分卷：{{book.sub}}</span>
						<span>章节：{{book.art}}</span>
						<span>字数：{{book.num}}</span>
					</view>
				</u-cell>
			</view>
		</view>
		<!--作品章节-->
		<u-subsection :list="list" :current="current" @change="SectionChange"></u-subsection>
		<view id='page0' v-if="current==0">
			<u-collapse  v-for="(item,index) in subart" :key="index">
			    <u-collapse-item :border="false" :title="item.article_name">
			        <u-cell-group :border="false" v-for="(item2,index2) in subart[index].children" :key="index2">
					    <u-cell :border="false" :title="item2.article_name" @click="GetContent(index,index2)"
					    :style="index2==subart[index].children.length-1?'':{'border-bottom':'1px solid #DDDDDD'}">
					    </u-cell>
				    </u-cell-group>
			    </u-collapse-item>
			</u-collapse>
		</view>
		<view id='page1' v-if="current==1">
			<u-cell-group :border="false" v-for="(item,index) in rel" :key="index">
			    <u-cell :border="false" :title="item.article_name" @click="GetContent2(index)"></u-cell>
			</u-cell-group>
		</view>
		<!--悬浮按钮-->
		<uni-fab horizontal="right" :content="fabcontent" @trigger="Trigger"></uni-fab>
		<!--新建分卷弹窗-->
		<u-popup :show="showsub" mode="center" :round="10" @close="CloseSub">
			<view>
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulessub" ref="subsection">
					<span style="text-align: center; font-weight: bold;">新建分卷</span>
					<u-form-item prop="article_name" ref="article_name">
						<u-input border="bottom" v-model="article.article_name" placeholder="请输入分卷名称"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="CheckSub"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="CloseSub"></u-button>
			</view>
		</u-popup>
		<!--新建章节弹窗-->
		<u-popup :show="showart" mode="center"  :round="10" @close="CloseArt">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesart" ref="article">
					<span style="text-align: center; font-weight: bold;">新建章节</span>
					<u-form-item label="选择分卷" labelWidth="70" prop="parent_id" ref="parent_id">
						 <uni-data-select v-model="article.parent_id" :localdata="selectsub" placeholder="请选择分卷" @change="SelectSub"></uni-data-select>
					</u-form-item>
					<u-form-item label="新章名称" labelWidth="70" prop="article_name" ref="article_name">
						<u-input v-model="article.article_name" placeholder="请输入章节名称"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="CheckArt"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="CloseArt"></u-button>
			</view>
		</u-popup>
		<!--新建相关弹窗-->
		<u-popup :show="showrel" mode="center"  :round="10" @close="CloseRel">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesrel" ref="article">
					<span style="text-align: center; font-weight: bold;">新建相关</span>
					<u-form-item prop="article_name" ref="article_name">
						<u-input border="bottom" v-model="article.article_name" placeholder="请输入相关名称"></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="CheckRel"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="CloseRel"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				_id: '',
				book: {},
				list: ['目录', '相关'],
				current:0,
				subart:[],//目录
				selectsub:[],//选择分卷
				rel: [],//相关
				fabcontent:[
					{text:'新建分卷',iconPath:'/static/img/folder.png',selectedIconPath:'/static/img/folderHL.png',active: false},
					{text:'新建章节',iconPath:'/static/img/file.png',selectedIconPath:'/static/img/fileHL.png',active: false},
					{text:'新建相关',iconPath:'/static/img/link.png',selectedIconPath:'/static/img/linkHL.png',active: false},
				],
				showsub: false,
				showart: false,
				showrel: false,
				article:{
					article_name: '',
					book_id: '',
					parent_id: ''
				},
				rulessub: {
					'article_name': {
						type: 'string',
						required: true,
						message: '请填写分卷名称',
						trigger: ['blur', 'change']
					},
				},
				rulesart: {
					'article_name': {
						type: 'string',
						required: true,
						message: '请填写章节名称',
						trigger: ['blur', 'change']
					},
				},
				rulesrel: {
					'article_name': {
						type: 'string',
						required: true,
						message: '请填写相关名称',
						trigger: ['blur', 'change']
					},
				},
			}
		},
		onLoad(option){
			this._id = option._id;
			this.GetBookDetail(option._id);
			this.GetSubArticle(option._id);
			this.GetRel(option._id)
		},
		methods: {
			//获取作品明细
			GetBookDetail(id){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyid',
						_id: id
					}
				}).then(res=>{
					this.book = res.result.data[0]
					//统计分卷数、章节数、字数
					var count1=0;var count2=0;var count3=0;
					for(var i=0;i<this.book._id.Article.length;i++){
						if(this.book._id.Article[i].parent_id!=null){//章节
						    count1 ++;
							count2 += this.book._id.Article[i].article_number
						}else{//分卷
							count3 ++;
						}
					}
					this.book.sub = count3
					this.book.art = count1
					this.book.num = count2
				})
			},
			//分段器切换
			SectionChange(index){
				this.current = index;
			},
			//获取目录（分卷章节的上下级关系）
			GetSubArticle(id){
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'selSubArt',
						_id: id
					}
				}).then(res=>{
					this.subart = res.result.data
					for(var i=0;i<this.subart.length;i++){
						this.selectsub.push({value:this.subart[i]._id,text:this.subart[i].article_name})
					}
				})
			},
			//获取相关
			GetRel(id){
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'selrel',
						_id: id
					}
				}).then(res=>{
					this.rel = res.result.data
				})
			},
			//点击章节
			GetContent(index,index2){
				var article_id = this.subart[index].children[index2]._id
				uni.navigateTo({
					url: '/pages/HomePage/content?_id='+article_id
				});
			},
			//点击相关
			GetContent2(index){
				var article_id = this.rel[index]._id
				uni.navigateTo({
					url: '/pages/HomePage/content?_id='+article_id
				});
			},
			//点击悬浮按钮
			Trigger(e){
				this.fabcontent[e.index].active = !e.item.active
				if(e.item.text=="新建分卷"&&this.fabcontent[0].active){
					this.showsub = true;
				}else if(e.item.text=="新建章节"&&this.fabcontent[1].active){
					this.showart = true;
				}else if(e.item.text=="新建相关"&&this.fabcontent[2].active){
					this.showrel = true;
				}
			},
			//关闭分卷弹窗
			CloseSub(){
				this.showsub = false;
				this.fabcontent[0].active = false
			},
			//关闭章节弹窗
			CloseArt(){
				this.showart = false;
				this.fabcontent[1].active = false
			},
			//关闭相关弹窗
			CloseRel(){
				this.showrel = false;
				this.fabcontent[2].active = false
			},
			//校验分卷
			CheckSub(){
				this.$refs.subsection.validate().then(res=>{
					uni.$u.toast('校验通过')
					this.SaveSubArt("sub")
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			//选择分卷
			SelectSub(e){
				this.article.parent_id = e
			},
			//校验章节
			CheckArt(){
				this.$refs.article.validate().then(res=>{
					uni.$u.toast('校验通过')
					this.SaveSubArt("art")
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			//校验相关
			CheckRel(){
				this.$refs.article.validate().then(res=>{
					uni.$u.toast('校验通过')
					this.SaveSubArt("rel")
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			//保存分卷/章节
			SaveSubArt(type){
				this.CloseSub()
				this.CloseArt()
				this.CloseRel()
				if(type=="rel"){
					this.article.article_type = "R"
				}
				this.article.book_id = this._id
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'add',
						article: this.article
					}
				}).then(res=>{
					this.article = {}
					this.selectsub = []
					this.GetBookDetail(this._id);
					this.GetSubArticle(this._id);
					uni.showToast({
						title: '新增成功！',
						icon: 'success'
					})
				})
			},
		}
	}
</script>

<style>
	span{
		display: block;
	},
	.subPanel {
		margin: auto;
		width: 90%;
	}
</style>
