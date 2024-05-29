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
						<!-- <span>标签：{{book.book_span}}</span> -->
						<span>分卷：{{book.sub}}</span>
						<span>章节：{{book.art}}</span>
						<span>字数：{{book.num}}</span>
					</view>
				</u-cell>
			</view>
		</view>
		<!--作品章节-->
		<view id='page0'>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				_id: '',
				book: {},
				subart:[],//目录
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
			/*******************************************/
			//点击章节
			GetContent(index,index2){
				var article_id = this.subart[index].children[index2]._id
				uni.navigateTo({
					url: '/pages/Find/read?_id='+article_id
				});
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
	/*
	木瑾颜低笑了一声，面向白陌朗：“听到没，某人不要太放肆。”
	“他跟我能一样？咋滴，你还能胳膊肘往外拐啊？”
	
	清平殿
	*/
</style>
