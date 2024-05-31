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
						<span>作者：{{book.author}}</span>
						<!-- <span>标签：{{book.book_name}}</span> -->
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
			<u-collapse v-for="(item,index) in subart" :key="index">
				<view v-if="subart[index].article_type=='S'" @longtap="LongPressSub(index)">
					<u-collapse-item :border="false" :title="item.article_name">
					    <u-cell-group :border="false" v-for="(item2,index2) in subart[index].children" :key="index2">
							<view @longtap="LongPressArt(index,index2)">
								<u-cell :border="false" :title="item2.article_name" @click="GetContent(index,index2)"
								:style="index2==subart[index].children.length-1?'':{'border-bottom':'1px solid #DDDDDD'}">
								</u-cell>
							</view>
					    </u-cell-group>
					</u-collapse-item>
				</view>
				<view v-else @longtap="LongPressArt2(index)">
					<u-cell :border="false" :title="subart[index].article_name" @click="GetContent3(index)"></u-cell>
				</view>
			</u-collapse>
		</view>
		<view id='page1' v-if="current==1">
			<u-cell-group :border="false" v-for="(item,index) in rel" :key="index">
				<view @longtap="LongPressRel(index)">
			        <u-cell :border="false" :title="item.article_name" @click="GetContent2(index)"></u-cell>
				</view>
			</u-cell-group>
		</view>
		<!--悬浮按钮-->
		<uni-fab horizontal="right" :content="fabcontent" @trigger="Trigger"></uni-fab>
		<!--新建分卷弹窗-->
		<u-popup :show="showsub" mode="center" :round="10" @close="CloseSub">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesart" ref="subsection">
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
		<u-popup :show="showart" mode="center" :round="10" @close="CloseArt">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesart" ref="article">
					<span style="text-align: center; font-weight: bold;">新建章节</span>
					<u-form-item label="选择分卷" labelWidth="70" prop="parent_id" ref="parent_id">
						 <uni-data-select v-model="article.parent_id" :localdata="selectsub" placeholder="未分卷" @change="SelectSub"></uni-data-select>
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
		<u-popup :show="showrel" mode="center" :round="10" @close="CloseRel">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesart" ref="article">
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
		<!--移至分卷弹窗-->
		<u-popup :show="showmove" mode="center" :round="10" @close="CloseMove">
			<view style="width: auto;margin: 10px;">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesmove" ref="article">
					<span style="text-align: center; font-weight: bold;">移至分卷</span>
					<u-form-item label="选择分卷" labelWidth="70" prop="parent_id" ref="parent_id">
						<uni-data-select style="width: auto;" v-model="article.parent_id" :localdata="selectsub" placeholder="请选择分卷" @change="SelectSub"></uni-data-select>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="CheckMove"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="CloseMove"></u-button>
			</view>
		</u-popup>
		<!--长按分卷弹窗-->
		<u-popup :show="showsublong" mode="right" :round="10" @close="CloseSubLong">
			<u-button @click="">排序</u-button>
			<u-button @click="UpdSubName">重命名</u-button>
			<u-button @click="SelSubDetail">详细信息</u-button>
			<u-button type="error" @click="DelSub">删除分卷</u-button>
		</u-popup>
		<!--长按章节弹窗-->
		<u-popup :show="showartlong" mode="right" :round="10" @close="CloseArtLong">
			<u-button @click="">排序</u-button>
			<u-button @click="UpdArtName">重命名</u-button>
			<u-button @click="MoveToSub">移至分卷</u-button>
			<u-button @click="SelArtDetail">详细信息</u-button>
			<u-button type="error" @click="DelArt">删除章节</u-button>
		</u-popup>
		<!--长按相关弹窗-->
		<u-popup :show="showrellong" mode="right" :round="10" @close="CloseRelLong">
			<u-button @click="">排序</u-button>
			<u-button @click="UpdRelName">重命名</u-button>
			<u-button @click="SelRelDetail">详细信息</u-button>
			<u-button type="error" @click="DelRel">删除</u-button>
		</u-popup>
		<!--修改分卷/章节/相关名称弹窗-->
		<u-popup :show="updname" mode="center" :round="10" @close="CloseUpdName">
			<view class="subPanel">
				<u-form labelPosition="left" labelWidth="100":model="article" :rules="rulesart" ref="article">
					<span style="text-align: center; font-weight: bold;">重命名</span>
					<u-form-item prop="article_name" ref="article_name">
						<u-input border="bottom" v-model="article.article_name" placeholder=""></u-input>
					</u-form-item>
				</u-form>
			</view>
			<view style="margin-left: auto">
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="确认" @click="UpdateSubArt"></u-button>
				<u-button type="primary" size="mini" :customStyle="{'border':'none','display':'inline'}" :plain="true" text="取消" @click="CloseUpdName"></u-button>
			</view>
		</u-popup>
		<!--详细信息展示-->
		<view>
			<u-popup :show="showinfo" overlayOpacity="0.1" :round="10" mode="center" @close="CloseInfo">
				<view style="width: auto;padding: 15px;">
					<span style="text-align: center; font-weight: bold;">详细信息</span>
					<span v-show="arttype=='sub'">分卷名：{{article.article_name}}</span>
					<span v-show="arttype=='sub'">章节数：{{article.art}}</span>
					<span v-show="arttype=='sub'">总字数：{{article.num}}</span>
					<span v-show="arttype=='art'">章节名：{{article.article_name}}</span>
					<span v-show="arttype=='art'">总字数：{{article.article_number}}</span>
					<span v-show="arttype=='rel'">相关名：{{article.article_name}}</span>
					<span v-show="arttype=='rel'">总字数：{{article.article_number}}</span>
					<span>创建时间：{{article.article_ctime}}</span>
					<span>修改时间：{{article.sys_time}}</span>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				_id: '',
				arttype: '',
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
				showsublong: false,
				showartlong: false,
				showrellong: false,
				updname: false,
				showinfo: false,
				showmove: false,
				article:{
					article_name: '',
					book_id: '',
					parent_id: ''
				},
				rulesart: {
					'article_name': {
						type: 'string',
						required: true,
						message: '请填写名称',
						trigger: ['blur', 'change']
					},
				},
				rulesmove: {
					'parent_id': {
						type: 'string',
						required: true,
						message: '请选择分卷',
						trigger: ['blur', 'change']
					},
				}
			}
		},
		onLoad(option){
			this._id = option._id;
			this.initData();
		},
		methods: {
			//初始化
			initData(){
				this.GetBookDetail(this._id);
				this.GetSubArticle(this._id);
				this.GetRel(this._id)
			},
			//获取作品明细
			GetBookDetail(id){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyidcount',
						_id: id
					}
				}).then(res=>{
					this.book = res.result.data[0]
					//统计分卷数、章节数、字数
					var count1=0;var count2=0;var count3=0;
					for(var i=0;i<this.book._id.Article.length;i++){
						if(this.book._id.Article[i].article_type=='S'){//分卷
						    count3 ++;
						}else{//章节
							count1 ++;
							count2 += this.book._id.Article[i].article_number
						}
					}
					this.book.author = this.book.book_author[0].user_name
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
				console.log(id)
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'selSubArt',
						_id: id
					}
				}).then(res=>{
					this.subart = res.result.data
					console.log("===>"+JSON.stringify(this.subart))
					for(var i=0;i<this.subart.length;i++){
						if(this.subart[i].article_type=='S'){
							this.selectsub.push({value:this.subart[i]._id,text:this.subart[i].article_name})
						}
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
			/*******************************************/
			//长按分卷
			LongPressSub(index){
				this.arttype = 'sub'
				this.article = {}
				this.showsublong = true;
				this.article._id = this.subart[index]._id;
				this.article.book_id = this.subart[index].book_id
				this.article.article_name = this.subart[index].article_name
				this.article.article_ctime = this.subart[index].article_ctime
				this.article.sys_time = this.subart[index].sys_time
				this.article.art = this.subart[index].children.length
				var count = 0
				for(var i = 0;i < this.subart[index].children.length;i++){
					count = count + this.subart[index].children[i].article_number
				}
				this.article.num = count
			},
			//重命名
			UpdSubName(){
				this.CloseSubLong()
				this.updname = true;
				//删除不存在的属性，仅显示用
				delete this.article.art
				delete this.article.num
			},
			//分卷详细信息
			SelSubDetail(){
				this.CloseSubLong()
				this.showsublong = false;
				this.showinfo = true;
			},
			//删除分卷
			DelSub(){
				this.CloseSubLong()
				this.showsublong = false;
				uni.showModal({
					title: "删除分卷",
					content: "删除分卷后不能恢复，请确认是否删除？",
					showCancel: true,
					success:(res)=>{
						if(res.confirm){
							uniCloud.callFunction({
								name:'Article',
								data:{
									type: 'del',
									_id: this.article._id
								}
							}).then(res=>{
								uni.showToast({
									title: '删除成功！',
									icon: 'success'
								})
								this.initData();
							})
						}
					}
				})
			},
			//长按章节
			LongPressArt(index,index2){
				this.showartlong = true;
				setTimeout(()=>{//关闭会同时打开的长按分卷
				    this.arttype = 'art'
				    this.article = {}
					this.showsublong = false;
					this.article._id = this.subart[index].children[index2]._id
					this.article.book_id = this.subart[index].children[index2].book_id
					this.article.parent_id = this.subart[index].children[index2].parent_id
					this.article.article_name = this.subart[index].children[index2].article_name
					this.article.article_ctime = this.subart[index].children[index2].article_ctime
					this.article.sys_time = this.subart[index].children[index2].sys_time
					this.article.article_number = this.subart[index].children[index2].article_number
				},200)
			},
			//长按未分卷章节
			LongPressArt2(index){
				this.showartlong = true;
				setTimeout(()=>{//关闭会同时打开的长按分卷
				    this.arttype = 'art'
				    this.article = {}
					this.showsublong = false;
					this.article._id = this.subart[index]._id
					this.article.book_id = this.subart[index].book_id
					this.article.parent_id = this.subart[index].parent_id
					this.article.article_name = this.subart[index].article_name
					this.article.article_ctime = this.subart[index].article_ctime
					this.article.sys_time = this.subart[index].sys_time
					this.article.article_number = this.subart[index].article_number
				},200)
			},
			//章节重命名
			UpdArtName(){
				this.CloseArtLong()
				this.updname = true;
			},
			//移至分卷
			MoveToSub(){
				this.CloseArtLong()
				this.showmove = true;
			},
			//章节详细信息
			SelArtDetail(){
				this.CloseArtLong()
				this.showartlong = false;
				this.showinfo = true;
			},
			//删除章节
			DelArt(){
				this.CloseArtLong()
				this.showartlong = false;
				uni.showModal({
					title: "删除章节",
					content: "删除章节后不能恢复，请确认是否删除？",
					showCancel: true,
					success:(res)=>{
						if(res.confirm){
							uniCloud.callFunction({
								name:'Article',
								data:{
									type: 'del',
									_id: this.article._id
								}
							}).then(res=>{
								uni.showToast({
									title: '删除成功！',
									icon: 'success'
								})
								this.initData();
							})
						}
					}
				})
			},
			//长按相关
			LongPressRel(index){
				this.arttype = 'rel'
				this.article = {}
				this.showrellong = true;
				this.article._id = this.rel[index]._id;
				this.article.book_id = this.rel[index].book_id
				this.article.article_name = this.rel[index].article_name
				this.article.article_ctime = this.rel[index].article_ctime
				this.article.sys_time = this.rel[index].sys_time
				this.article.article_number = this.rel[index].article_number
			},
			//相关重命名
			UpdRelName(){
				this.CloseRelLong()
				this.updname = true;
			},
			//相关详细信息
			SelRelDetail(){
				this.CloseRelLong()
				this.showrellong = false;
				this.showinfo = true;
			},
			//删除相关
			DelRel(){
				this.CloseRelLong()
				this.showrellong = false;
				uni.showModal({
					title: "删除相关",
					content: "删除相关后不能恢复，请确认是否删除？",
					showCancel: true,
					success:(res)=>{
						if(res.confirm){
							uniCloud.callFunction({
								name:'Article',
								data:{
									type: 'del',
									_id: this.article._id
								}
							}).then(res=>{
								uni.showToast({
									title: '删除成功！',
									icon: 'success'
								})
								this.initData();
							})
						}
					}
				})
			},
			//点击章节
			GetContent(index,index2){
				var article_id = this.subart[index].children[index2]._id
				uni.navigateTo({
					url: '/pages/HomePage/content2?_id='+article_id
				});
			},
			//未分卷章节
			GetContent3(index){
				var article_id = this.subart[index]._id
				uni.navigateTo({
					url: '/pages/HomePage/content2?_id='+article_id
				});
			},
			//点击相关
			GetContent2(index){
				var article_id = this.rel[index]._id
				uni.navigateTo({
					url: '/pages/HomePage/content2?_id='+article_id
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
			/*******************************************/
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
			//关闭长按分卷弹窗
			CloseSubLong(){
				this.showsublong = false;
			},
			//关闭长按章节弹窗
			CloseArtLong(){
				this.showartlong = false;
			},//关闭长按相关弹窗
			CloseRelLong(){
				this.showrellong = false;
			},
			//关闭修改名称弹窗
			CloseUpdName(){
				this.updname = false;
			},
			//关闭详细信息弹窗
			CloseInfo(){
				this.showinfo = false;
			},
			//关闭移至分卷弹窗
			CloseMove(){
				this.showmove = false;
			},
			/*******************************************/
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
			//校验移至分卷
			CheckMove(){
				this.$refs.article.validate().then(res=>{
					uni.$u.toast('校验通过')
					this.UpdateSubArt("move")
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
				}else if(type=='sub'){
					this.article.article_type = "S"
				}else if(type=='art'){
					this.article.article_type = "A"
				}
				this.article.article_number = 0
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
					uni.showToast({
						title: '新增成功！',
						icon: 'success'
					})
					this.initData();
				})
			},
			//更新分卷/章节
			UpdateSubArt(type){
				this.CloseUpdName();
				this.CloseMove();
				var id = this.article._id;
				delete this.article._id//删除属性_id，修改不能带_id
				var title = "";
				if(type=="move"){
					title = "移至分卷成功！"
				}else{
					title = "重命名成功！"
				}
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'upd',
						_id: id,
						article: this.article
					}
				}).then(res=>{
					this.selectsub = []
					uni.showToast({
						title: title,
						icon: 'none'
					})
					this.initData();
				})
			}
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
