<!--我的书架-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar title="我的书架" leftIcon="" :placeholder="true"
		bgColor="">
			<view slot="right" style="display: flex;">
				<u-icon name="reload" size="22"></u-icon>
				<u-icon name="plus" size="22" style="margin: 10px;" @click="AddBook"></u-icon>
				<u-icon name="more-dot-fill" size="22"></u-icon>
			</view>
		</u-navbar>
		<!--作品列表-->
		<view>
			<u-list @scrolltolower="LoadMore">
				<u-list-item v-for="(item,index) in list" :key="index">
					<view @longtap="LongPress(index)">
						<u-cell @click="BookDetail">
							<u-image slot="icon" :showLoading="true" width="80px" height="100px" 
							:src="item.book_picture"></u-image>
							<view slot="title" class="u-flex-column">
								<span style="font-weight: bold;font-size: 18px;">{{item.book_name}}</span>
								<span style="margin-top: 30px;">{{item.book_author}} 著</span>
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
		<!--长按弹出层-->
		<view>
			<u-popup :show="showpopup" overlayOpacity="0.1" mode="bottom" @close="PopupClose">
				<view style="display: flex; flex-wrap: wrap;">
					<u-icon style="margin:10px 16px;" name="file-text" size="30px" label="修改信息" labelSize="10px" labelPos="bottom" @click="UpdateBook"></u-icon>
					<u-icon style="margin:10px 16px;" name="arrow-upward" size="30px" label="导出作品" labelSize="10px" labelPos="bottom"></u-icon>
					<u-icon style="margin:10px 16px;" name="share" size="30px" label="发送作品" labelSize="10px" labelPos="bottom"></u-icon>
					<u-icon style="margin:10px 16px;" name="share-square" size="30px" label="备份至云盘" labelSize="10px" labelPos="bottom"></u-icon>
					<u-icon style="margin:10px 16px;" name="info-circle" size="30px" label="详细信息" labelSize="10px" labelPos="bottom"></u-icon>
					<u-icon style="margin:10px 16px;" name="trash" size="30px" label="删除作品" labelColor="red"	labelSize="10px" labelPos="bottom"@click="DelBook"></u-icon>
				</view>
				<u-button text="取消" :plain="true" @click="PopupClose"></u-button>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import DelPicture from "../../common/util.js";
	export default{
		data(){
			return{
				list: [],
				showpopup: false,
				_id: '',
				index: '',
			}
		},
		onLoad(){
			this.GetMyCreated();
		},
		methods: {
			//长按弹出
			LongPress(index){
				this.showpopup = true;
				this.index = index;
				this._id = this.list[index]._id._value
			},
			//关闭弹出层
			PopupClose(){
				this.showpopup = false;
			},
			//加载更多
			LoadMore(){
				
			},
			//新增作品
			AddBook(){
				uni.navigateTo({
					url: '/pages/HomePage/aubook'
				});
			},
			//修改作品
			UpdateBook(){
				uni.navigateTo({
					url: '/pages/HomePage/aubook?_id='+this._id
				});
			},
			//删除作品
			DelBook(){
				this.showpopup = false;
				uni.showModal({
					title: "谨慎操作",
					content: "请确认是否删除该作品？",
					showCancel: true,
					success:(res)=>{
						if(res.confirm){
							uniCloud.callFunction({
								name:'Book',
								data:{
									type: 'del',
									_id: this._id
								}
							}).then(res=>{
								uni.showToast({
									title: '删除成功！',
									icon: 'success'
								})
								DelPicture.DelPicture('Book','delpicture',this.list[this.index].book_picture)
								this.GetMyCreated()
							})
						}
					}
				})
			},
			//作品详情页面
			BookDetail(){
				console.log("跳转至作品详情")
			},
			//查询我的作品
			GetMyCreated(){
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyauthor',
						book_author: '小白'
					}
				}).then(res=>{
					this.list = res.result.data
					//统计分卷数、章节数、字数
					for(var i=0;i<this.list.length;i++){
						var count1=0;var count2=0;var count3=0;
						for(var j=0;j<this.list[i]._id.Article.length;j++){
							if(this.list[i]._id.Article[j].parent_id!=null){//章节
							    count1 ++;
								count2 += this.list[i]._id.Article[j].article_number
							}else{//分卷
								count3 ++;
							}
						}
						this.list[i].sub = count3
						this.list[i].art = count1
						this.list[i].num = count2
					}
					//console.log(res)
					//console.log(this.list)
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	span{
		display: block;
	}
</style>