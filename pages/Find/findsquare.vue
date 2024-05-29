<template>
	<view>
		<!--导航栏-->
		<u-navbar title="书城" leftIcon="" :placeholder="true" bgColor="">
			<!-- <view slot="right" style="display: flex;">
				<u-icon name="grid" size="25" label="分类" labelSize="10px" space="1px" labelPos="bottom"></u-icon>
			</view> -->
		</u-navbar>
		<!--搜索框-->
		<u-search placeholder="请输入书名搜索" v-model="book.book_name" @custom="GetBook" ></u-search>
		<!--作品列表-->
		<view>
			<u-list>
				<u-list-item v-for="(item,index) in list" :key="index">
					<view>
						<u-cell @click="BookDetail(index)">
							<u-image slot="icon" :showLoading="true" width="80px" height="100px" 
							:src="item.book_picture"></u-image>
							<view slot="title" class="u-flex-column">
								<span style="font-weight: bold;font-size: 18px;">{{item.book_name}}</span>
								<span style="margin-top: 30px;">{{item.author}} 著</span>
								<span>{{item.sub}}卷{{item.art}}章</span>
							</view>
							<view slot="value" class="u-flex">
								<span style="margin-top: 70px;">{{item.num}}字</span>
							</view>
						</u-cell>
					</view>
				</u-list-item>
			</u-list>
		</view>
	</view>
</template>


<script>
	import {mapState} from 'vuex';
	export default{
		data(){
			return{
				_id: '',
				list: [],
				book: {},
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			this.list = [];
			this.GetBook()
		},
		onLoad(option){
			
		},
		methods: {
			//列表
			GetBook(){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyname',
						book_name: this.book.book_name,
						book_author: this.userInfo._id
					}
				}).then(res=>{
					this.list = res.result.data
					//统计分卷数、章节数、字数
					for(var i=0;i<this.list.length;i++){
						var count1=0;var count2=0;var count3=0;
						for(var j=0;j<this.list[i]._id.Article.length;j++){
							if(this.list[i]._id.Article[j].article_type=='S'){//分卷
							    count3 ++;
							}else{//章节
								count1 ++;
								count2 += this.list[i]._id.Article[j].article_number
							}
						}
						this.list[i].author = this.list[i].book_author[0].user_name
						this.list[i].sub = count3
						this.list[i].art = count1
						this.list[i].num = count2
					}
				})
			},
			//详情页面
			BookDetail(index){
				this._id = this.list[index]._id._value
				uni.navigateTo({
					url: '/pages/Find/read2?_id='+this._id
				});
			},
		}
	}
</script>

<style>
	span{
		display: block;
	}
</style>
  