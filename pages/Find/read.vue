<!--阅读模式（废弃）-->
<template>
	<view class="zai-read-box skin" :class="skinValue"> 
		<!--封面层-->
		<view class="zai-read-cover-box" @touchstart="coverStart" @touchend="coverEnd" @touchmove="coverMove" :class="coverShow?'show':''">
			<view class="zai-read-cover" :style="{transform: `translateX(${coverInfo.translate + coverInfo.move}px)`, transition: `all ${animationSeconds}s ease`}">
				<view class="zai-cover-v">
					<text class="zai-cover-cor"></text>
					<text class="zai-cover-cor"></text>
					<text class="zai-cover-cor"></text>
					<text class="zai-cover-cor"></text>
					<view class="zai-cover-info">
						<view class="zai-cover-figure">
							<image :src="BookData.book_picture" mode="widthFix" class="zai-cover-img"></image>
						</view>
						<view class="zai-cover-title">{{BookData.book_name}}</view>
						<view class="zai-cover-author">{{BookData.author}} 著</view>
						
						<view class="cu-bar tabbar zai-cover-data">
							<view class="action">
								<!-- <view class="title">{{BookInfo.sort}}</view> -->
								<view class="title">其他</view>
								<view class="text-gray">类型</view>
							</view>
							<view class="action">
								<!-- <view class="title">{{BookInfo.news}}</view> -->
								<view class="title">第一章</view>
								<view class="text-gray">更新</view>
							</view>
							<view class="action">
								<!-- <view class="title">{{BookInfo.state}}</view> -->
								<view class="title">连载中</view>
								<view class="text-gray">状态</view>
							</view>
						</view>
						
					</view>
					<!-- <view class="zai-cover-copy">
						<view class="ell">本书的所有内容抓取自免费小说网站</view>
						<view class="text-gray">©版权所有 请支持正版</view>
					</view> -->
				</view>
				<view class="zai-cover-h" @click="coverClick"></view>
			</view>
		</view> 
		<!--阅读层-->
		<view class="zai-read " :class="layoutValue" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
			<view class='zai-content'>
				<view class="zai-article">
					<view class="zai-section" id='readerBook'
					:style="{transform: `translateX(${translateX + move}px)`, transition: `all ${animationSeconds}s ease`, fontSize: `${fontSize}rem`}" 
					v-html="ReadContent"></view>
				</view>
			</view>
			<!--页码-->
			<text class="zai-page-num text-sm">{{ pageCurrent + 1 }}/{{ pageTotal }}</text>
			<!--区域操作-->
			<view class="zai-hover-box" v-if="layoutValue == 'H'">
				<view class="flex flex-wrap">
					<view @click="previousPage" class="basis-sm zai-hover-left"></view>
					<view @click="onCenter" class="basis-xs zai-hover-centre"></view>
					<view @click="nextPage" class="basis-sm zai-hover-right"></view>
				</view>
			</view>
			<view class="zai-hover-box" v-if="layoutValue == 'V'" @click="onCenter"></view>
		</view>
		<!--操作层-->
		<view class="zai-opt-box" :class="optShow?'show':''">
			<!--底层空白层-->
			<view class="zai-off-hover" @click="onToEnd"></view>
			<text class="bg-black text-gray zai-join-book" @click="AddClick" v-if="addBtn==false">加入书架</text>
			<!--底部操作层-->
			<view class="cu-bar tabbar bg-black zai-opt-footer">
				<view class="action text-gray" @click="asideClick">
					<view class="cuIcon-sort"></view>
					<view>目录</view>
				</view>
				<view class="action text-gray" @click="optBotClick">
					<view class="cuIcon-read"></view>
					<view>章节</view>
				</view>
				<view class="action text-gray" @click="optSetClick">
					<view class="cuIcon-wenzi"></view>
					<view>设置</view>
				</view>
			</view>
			
			<!--章节层-->
			<view class="cu-bar bg-black zai-opt-bot" :class="optBotShow?'show':''">
				<view class="action" @click="previousReadClick">
					<text class="cuIcon-back"></text>
					<text>上一章</text>
				</view>
				<view class="content text-bold">{{BookList[artindex].article_name}}</view>
				<view class="action" @click="nexReadClick">
					<text>下一章</text>
					<text class="cuIcon-right"></text>
				</view>
			</view>
			
			<!--设置层-->
			<view class="bg-black zai-opt-bot" :class="optSetShow?'show':''">
				<!--字体大小层-->
				<view class="cu-bar solid-bottom">
					<view class="action" @click="fontSizeMove">
						<text class="cuIcon-move"></text>
					</view>
					<view class="content" style="width: calc(100% - 182rpx); pointer-events: all;">
						<slider :value="fontSizeSlider" activeColor="#f37b1d" backgroundColor="#464646" block-color="#f37b1d" block-size="12" min="1" max="8" @change="fontSizeChange" @changing="fontSizeChange"/>
					</view>
					<view class="action" @click="fontSizeAdd">
						<text class="cuIcon-add"></text>
					</view>
				</view>
				<!--样式层-->
				<view class="grid col-5 padding-sm solid-bottom">
					<view class="padding-xs" v-for="(item,index) in skinData" :key="index">
						<button class="cu-btn block line-orange text-xl text-bold btn-skin" :class="item.key" v-if="item.checked">
							<text class="cuIcon-check text-orange"></text>
						</button>
						<button class="cu-btn block btn-skin" @tap="skinCheckbox(index,item.key)" :class="item.key" v-else></button>
					</view>
				</view>
				<!--翻页方式层-->
				<view class="grid col-2 padding-sm">
					<view class="padding-xs" v-for="(item,index) in layoutData" :key="index">
						<button class="cu-btn block line-white" v-if="item.checked">
							<text class="text-white">{{item.name}}</text>
						</button>
						<button class="cu-btn block line-gray" @tap="layoutCheckbox(index,item.key)" v-else>
							<text class="text-gray">{{item.name}}</text>
						</button>
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!--章节目录层-->
		<view class="zai-aside" :class="asideShow?'show':''">
			<!--底层空白层-->
			<view class="zai-off-hover" @click="asideShow = false"></view>
			<!--目录层-->
			<view class="zai-aside-content">
				<view class="bg-white text-orange text-center padding zai-nav-title">章节目录</view>
				<view class="zai-chapter-tab-x">
					<view class="cu-bar bg-white">
						<view class="action">
							<text>共{{BookList.length}}章</text>
						</view>
						<view class="action">
							<text @click="orderClick">{{order}}</text>
						</view>
					</view>
					<view class="cu-bar zai-title-f">
						<view class="action">
							<text class="text-sm">正文卷</text>
						</view>
					</view>
					<!--章节列表-->
					<view class="cu-list menu bg-white">
						<view class="cu-item" v-for="(item,index) in BookList" :key="index" @click="details(item,index)">
							<view class="content" v-if="order=='倒序'">
								{{item.article_name}}
							</view>
							<view class="content" v-else>
								{{item.article_name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	    data() {
	        return {
				_id: '',//书籍id
				artindex: 0,//章节id
				turnType: 0,//翻页类型（上/下一页，上/下一章）
				pageTotal: 0, //本章所有页码
				pageCurrent: 0, //所在页码
				translateX: 0, //内容动画信息
				startPoint: 0, 
				move: 0, 
				animationSeconds: 0.3, 
				fontSize: 1, //字体大小
				clearance: 4,
				optShow: false, //是否显示操作层
				asideShow: false, //是否显示目录（操作层）
				optBotShow: false, //是否显示章节（操作层）
				optSetShow: false, //是否显示设置（操作层）
				order: '倒序', //排序
				fontSizeSlider: 2,//字体大小（滑块）
				skinData: [], //皮肤数据
				skinValue: 'default', //默认选择皮肤
				layoutData: [], //滑动数据
				layoutValue: 'H', //默认选择滑动方式（左右滑动）
				domInfo: {}, //宽高信息
				coverShow: true, //是否显示封面
				BookData: {},//书籍信息
				coverInfo: {//封面动画信息
					startPoint: 0, 
					move: 0, 
					translate: 0,
				}, 
				ReadContent: '', //章节内容
				BookList: [{article_name:''}], //章节列表
				addBtn: true,//加入书架
	        } 
	    },
		onLoad(options) {
			this._id = options._id
			//初始化皮肤数据
			this.skinData = [
				{key: 'default',checked: true},{key: 'blue',checked: false},
				{key: 'green',checked: false},{key: 'light',checked: false},
				{key: 'night',checked: false}
			];
			//初始化滑动数据
			this.layoutData = [
				{key: 'H',name: '左右滑动',checked: true},{key: 'V',name: '上下滑动',checked: false}
			];
			this.iniGetBookInfo()
		},
		onReady() {
			
		},
		onPullDownRefresh() {
			if(this.layoutValue == 'V') {
				if(this.artindex<=0) {
					//显示封面
					this.coverShow = true;
					this.coverInfo.translate = 0;
				} else {
					this.artindex--;
					this.getNewReadContent(this.artindex,1);
				}
			}
			uni.stopPullDownRefresh();
		},
		//滚动到底部，上下翻页
		onReachBottom() {
			if(this.layoutValue == 'V') {
				this.nexReadClick();
			}
		},
		methods: {
			iniGetBookInfo() {
				//获取书籍信息
				this.GetBookDetails(this._id);
				//获取书籍内容
				this.GetReadContent(this._id);
			},
			//获取书籍信息
			GetBookDetails(id) {
				uniCloud.callFunction({
					name:'Book',
					data:{
						type: 'selbyid',
						_id: id
					}
				}).then(res=>{
					this.BookData = res.result.data[0]
					this.BookData.author = this.BookData.book_author[0].user_name
				})
			},
			//获取章节内容
			GetReadContent(id) {
				uniCloud.callFunction({
					name:'Article',
					data:{
						type: 'selart',
						_id: id
					}
				}).then(res=>{
					this.BookList = res.result.data
					this.ReadContent = res.result.data[0].article_content
					console.log(this.ReadContent)
					if(this.layoutValue == 'H') {
						this.GetDomWidthValue(0);
					} else if (this.layoutValue == 'V') {
						uni.pageScrollTo({
						    scrollTop: 0,
						    duration: 300
						});
					}
				})
			},
			GetDomWidthValue() {
				this.SetDomWidthValue().then((res) => {
					this.domInfo = res;
					this.calculateTotalPage();
				});
			},
			SetDomWidthValue() {
				return new Promise((resolve) => {
					setTimeout(() => {
						let scrollWidth = document.getElementById("readerBook").scrollWidth;
						let offsetWidth = document.getElementById("readerBook").offsetWidth;
						resolve({scrollWidth: Number(scrollWidth), offsetWidth: Number(offsetWidth) });
					}, 400);
				});
			},
			//设置页码
			SetReadPage() {
				//除“上一页”外重置页码
				if(this.turnType==0){
					this.pageCurrent = 0; 
				}else if(this.turnType==1){
					this.pageCurrent = this.pageTotal-1; 
				}
				this.calculateTranslateX();
			},
			//开始触摸（封面）
			coverStart(e) {
				this.coverInfo.startPoint = e.touches[0].clientX;
			},
			//结束触摸（封面）
			coverEnd(e) {
				let end = e.changedTouches[0].clientX;
				let start = this.coverInfo.startPoint;
				let delta = start - end;
				if (delta > 10) {
					this.calculateCoverTranslate('left');
				} else if (delta < -10) {
					this.calculateCoverTranslate('right');
				}
				this.coverInfo.move = 0;
			},
			//连续触摸（封面）
			coverMove(e) {
				this.coverInfo.move = e.changedTouches[0].clientX - this.coverInfo.startPoint;
			},
			//点击封面
			coverClick() {
				this.calculateCoverTranslate('click');
			},
			//点击、左滑、右滑封面
			calculateCoverTranslate(sort) {
				if(sort=='left' || sort=='click') {
					this.coverInfo.translate = -(this.domInfo.offsetWidth + this.clearance);
				} else if (sort=='right') {
					this.coverInfo.translate = this.domInfo.offsetWidth + this.clearance;
				}
				setTimeout(() => {
					this.coverShow = false;
				}, 300);
			},
			//开始触摸（阅读）
	        touchStart(e) {
				if(this.layoutValue == 'H') {
					this.startPoint = e.touches[0].clientX;
				}
			},
			//结束触摸（阅读）
			touchEnd(e) {
				if(this.layoutValue == 'H') {
					let end = e.changedTouches[0].clientX;
					let start = this.startPoint;
					let delta = start - end;
					if (delta > 10) {
						this.nextPage();
					} else if (delta < -10) {
						this.previousPage();
					}
					this.move = 0;
				}
			},
			//连续触摸（阅读）
			touchMove(e) {
				if(this.layoutValue == 'H') {
					this.move = e.changedTouches[0].clientX - this.startPoint;
				}
			},
			//点击下一页
			nextPage() {
				if (this.noLeftRightClick) return;
				if (this.calculatePage(this.pageCurrent)) {
					if(this.BookList.length-1 > this.artindex) {
						this.artindex++;
						this.turnType = 0;
						this.getNewReadContent(this.artindex);
					}else{
						uni.showToast({title: '阅读完啦！',icon: 'none'})
						return;
					}
				}else{
					this.pageCurrent++;
					this.calculateTranslateX();
				}
			},
			//点击上一页
			previousPage() {
				if (this.noLeftRightClick) return;
				if (this.pageCurrent <= 0) {
					if(this.artindex<=0) {
						//显示封面
						this.coverShow = true;
						this.coverInfo.translate = 0;
					}else{
						this.artindex--;
						this.turnType = 1;
						this.getNewReadContent(this.artindex);
					} 
					return;
				}
				this.pageCurrent--;
				this.calculateTranslateX();
			},
			//点击上一章
			previousReadClick() {
				if(this.artindex>0) {
					this.artindex--;
					this.turnType = 0;
					this.onToEnd();
					this.getNewReadContent(this.artindex);
				}else{
					uni.showToast({title: '没有上一章啦！',icon: 'none'})
				}
			},
			//点击下一章
			nexReadClick() {
				if(this.artindex < this.BookList.length-1) {
					this.artindex++;
					this.turnType = 0;
					this.onToEnd();
					this.getNewReadContent(this.artindex);
				}else{
					uni.showToast({title: '没有下一章啦！',icon: 'none'})
				}
			},
			//打开章节列表
			details(item,index) {
				this.artindex = index ;
				this.turnType = 0;
				this.onToEnd();
				this.getNewReadContent(this.artindex);
			},
			//获取章节内容
			getNewReadContent(id) {
				this.ReadContent = this.BookList[id].article_content
				if(this.layoutValue == 'H') {
					this.GetDomWidthValue(this.turnType);
				} else if (this.layoutValue == 'V') {
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 300
					});
				}
			},
			calculateTranslateX() {
				//console.log(this.domInfo)
				//console.log("("+this.domInfo.offsetWidth+"+"+this.clearance+")*"+this.pageCurrent)
				this.translateX = -(this.domInfo.offsetWidth + this.clearance) * (this.pageCurrent);
			},
			//计算所在页码
			calculatePage(page) {
				const number = (this.domInfo.offsetWidth) * (page + 1);
				return this.domInfo.scrollWidth - number <= this.domInfo.offsetWidth;
			},
			//计算所有页码
			calculateTotalPage() {
				this.$nextTick(() => {
					this.pageTotal = parseInt(this.domInfo.scrollWidth / (this.domInfo.offsetWidth));
					this.SetReadPage();
				});
			},
			//关闭操作层
			onToEnd() {
			    this.optShow = false;
				this.optBotShow = false;
				this.asideShow = false;
				this.optSetShow = false;
			},
			//打开操作层
			onCenter() {
				this.optShow = true;
			},
			//目录
			asideClick() {
				this.optBotShow = false;
				this.optSetShow = false;
				if(this.asideShow == true) {
					this.asideShow = false;
				} else {
					this.asideShow = true;
				}
			},
			//章节
			optBotClick() {
				this.asideShow = false;
				this.optSetShow = false;
				if(this.optBotShow==true) {
					this.optBotShow = false;
				} else {
					this.optBotShow = true;
				}
			},
			//设置
			optSetClick () {
				this.optBotShow = false;
				this.asideShow = false;
				if(this.optSetShow==true) {
					this.optSetShow = false;
				} else {
					this.optSetShow = true;
				}
			},
			//滑动字体大小
			fontSizeMove() {
				let Size = this.fontSizeSlider;
				if(Size > 1) {
					let num = Size - 1 ;
					this.fontSizeSlider = num;
					this.SetFontSize(num);
				}
			},
			//增加字体大小
			fontSizeAdd() {
				let Size = this.fontSizeSlider;
				if(Size < 8) {
					let num = Size + 1 ;
					this.fontSizeSlider = num;
					this.SetFontSize(num);
				}
			},
			//设置字体大小
			fontSizeChange(e) {
				let num = e.detail.value;
				this.SetFontSize(num);
			},
			//设置字体大小
			SetFontSize(num) {
				if(num == 1) {
					this.fontSize = 0.875;
				} else if(num == 2) {
					this.fontSize = 1;
				} else if(num == 3) {
					this.fontSize = 1.125;
				} else if(num == 4) {
					this.fontSize = 1.25;
				} else if(num == 5) {
					this.fontSize = 1.375;
				} else if(num == 6) {
					this.fontSize = 1.5;
				} else if(num == 7) {
					this.fontSize = 1.625;
				} else if(num == 8) {
					this.fontSize = 1.75;
				}
			},
			//选择皮肤
			skinCheckbox(index,key) {
				let items = this.skinData;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					this.skinData[i].checked = false;
				}
				this.skinData[index].checked = true;
				this.skinValue = key;
				
				if(key=='default') {
					uni.setNavigationBarColor({
						frontColor: '#000000',
					    backgroundColor: '#c4b395'
					});
				} else if(key=='blue') {
					uni.setNavigationBarColor({
						frontColor: '#000000',
					    backgroundColor: '#cad9e8'
					});
				} else if(key=='green') {
					uni.setNavigationBarColor({
						frontColor: '#000000',
					    backgroundColor: '#d1edd1'
					});
				} else if(key=='light') {
					uni.setNavigationBarColor({
						frontColor: '#000000',
					    backgroundColor: '#e6e6e6'
					});
				} else if(key=='night') {
					uni.setNavigationBarColor({
						frontColor: '#ffffff',
					    backgroundColor: '#1a1a1a'
					});
				}
			},
			//翻页方式
			layoutCheckbox(index,key) {
				let items = this.layoutData;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					this.layoutData[i].checked = false;
				}
				this.layoutData[index].checked = true;
				this.layoutValue = key;
			},
			//排序
			orderClick() {
				let order = this.order;
				if(order=='正序') {
					this.order = '倒序';
				} else {
					this.order = '正序';
				}
				//排序
				this.BookList = [...this.BookList].reverse();
				//更改artindex
				this.artindex = this.BookList.length-this.artindex-1
			}
	    }
	}
</script>

<style scoped lang="less">
	@import "../../colorui/icon.css";
	@import "../../colorui/main.css";
	@import "../../colorui/animation.css";
	.zai-read-cover-box,.zai-read-cover,.zai-aside,.H,.zai-opt-box,.zai-off-hover {
		position: fixed;
		top: 0;
		left: 0;
	}
	.zai-read-box, .zai-read-box,.zai-read-cover,.H,.zai-opt-box,.zai-off-hover {
		width: 100%;
		height: 100%;
	}
	.zai-off-hover, .zai-aside-content,.zai-chapter-tab-x {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.zai-read-box {
		position: relative;
		.zai-read-cover-box {
			z-index: 9999;
			display: none;
		}
		.zai-read-cover-box.show {
			display: block;
		}
		.zai-read-cover {
			z-index: 999;
			box-shadow: 0 0 19rpx rgba(0,0,0,.2);
			color: rgba(0,0,0,.85);
			transition: transform .25s,opacity .25s;
			.zai-cover-v {
				position: absolute;
				top: 29rpx;
				right: 39rpx;
				bottom: 29rpx;
				left: 39rpx;
				text-align: center;
				white-space: nowrap;
				border-top: 2rpx solid rgba(0,0,0,.2);
				border-bottom: 2rpx solid rgba(0,0,0,.2);
				&::after {
				    display: inline-block;
				    height: 80%;
				    content: '';
				    vertical-align: middle;
				}
				.zai-cover-cor {
					position: absolute;
					width: 19rpx;
					height: 19rpx;
					text-align: left;
					&:nth-of-type(1) {
					    top: -2rpx;
					    left: -10rpx;
					}
					&:nth-of-type(2) {
						top: -2rpx;
						right: -10rpx;
						transform: scaleX(-1);
					}
					&:nth-of-type(3) {
					    right: -10rpx;
					    bottom: -2rpx;
					    transform: scale(-1,-1);
					}
					&:nth-of-type(4) {
					    bottom: -2rpx;
					    left: -10rpx;
					    transform: scaleY(-1);
					}
					&::after, &::before {
					    position: absolute;
					    content: '';
					    border: 2rpx solid rgba(0,0,0,.2);
					}
					&::before {
					    width: 10rpx;
					    height: 10rpx;
					    border-width: 0 2rpx 2rpx 0;
					}
					&::after {
					    top: 10rpx;
					    left: 10rpx;
					    width: 6rpx;
					    height: 6rpx;
					    border-radius: 0 2rpx 2rpx 2rpx;
					}
				}
				.zai-cover-info {
					display: inline-block;
					width: 100%;
					vertical-align: middle;
					line-height: 1.5;
					.zai-cover-figure {
						display: inline-block;
						padding: 6rpx;
						border: 2rpx solid #efece5;
						background-color: #fcfcfa;
						.zai-cover-img {
							display: block;
							width: 5.625rem;
							height: 7.5rem;
							//filter: grayscale(100%);
						}
					}
					.zai-cover-title {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 1.4rem;
						font-weight: 700;
					}
					.zai-cover-author {
						color: rgba(0,0,0,.4);
						font-size: 0.8rem;
					}
					.zai-cover-data {
						margin-top: 3.25rem;
						.action {
							line-height: 1.5;
							font-size: 34rpx;
							.title {
								font-weight: bold;
							}
							.text-gray {
								color: rgba(0,0,0,.4);
								font-size: 0.8rem;
							}
						}
					}
				}
				.zai-cover-copy {
					font-size: 0.7rem;
					position: absolute;
					right: 0;
					bottom: 1.3125rem;
					left: 0;
					line-height: 1.5;
					.ell {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.text-gray {
						color: rgba(0,0,0,.4);
					}
				}
			}
			.zai-cover-h {
				position: absolute;
				top: 39rpx;
				right: 29rpx;
				bottom: 39rpx;
				left: 29rpx;
				border-right: 2rpx solid rgba(0,0,0,.2);
				border-left: 2rpx solid rgba(0,0,0,.2);
			}
		}
		.zai-aside {
			right: 0;
			bottom: 0;
			z-index: 3;
			overflow: hidden;
			visibility: hidden;
			transition: visibility .25s;
			.zai-off-hover {
				transition: opacity .25s;
				background-color: #000;
				opacity: 0;
			}
			.zai-aside-content {
				left: 5.5rem;
				color: #969ba3;
				transition: transform .15s;
				transform: translateX(100%);
				background-color: #f6f7f9;
				.zai-nav-title {
					border-bottom: 2rpx solid #f37b1d;
					z-index: 9;
				}
				.zai-chapter-tab-x {
					top: 2.6rem;
					overflow: auto;
					.zai-title-f {
						min-height: 65rpx;
					}
				}
			}
		}
	}
	.zai-aside.show {
		visibility: visible;
		transition: none;
		.zai-off-hover {
			opacity: .6;
		}
		.zai-aside-content {
			transform: translate(0,0);
		}
	}
	.skin.default {
		.zai-read-cover,.zai-read {
			background: url(../../static/img/skin-default-t.jpg) no-repeat center top,
						url(../../static/img/skin-default-b.jpg) no-repeat center bottom,
						url(../../static/img/skin-default-m.jpg) repeat-y center 217rpx;
			background-size: 100%;
			color: rgba(0,0,0,.85);
		}
	}
	.skin.blue {
		.zai-read-cover,.zai-read {
			background: #cad9e8;
		}
	}
	.skin.green {
		.zai-read-cover,.zai-read {
			background: #d1edd1;
		}
	}
	.skin.light {
		.zai-read-cover,.zai-read {
			background: #e6e6e6;
		}
	} 
	.skin.night{
		.zai-read-cover,.zai-read {
			background: #1a1a1a;
			color: rgba(255,255,255,.5);
		}
	}
	.zai-read {
		.zai-content {
			.zai-article {
				font-size: 1rem;
				line-height: 1.8;
				overflow: hidden;
				min-height: calc(100vh - 79rpx);
				margin: 0 29rpx;
				text-align: justify;
				.zai-section {
					overflow: hidden;
					min-height: inherit;
					-webkit-transform-style: preserve-3d;
					-webkit-backface-visibility: hidden;
					-webkit-perspective: 1000;
				}
			}
		}
		.zai-page-num {
			position: absolute;
			bottom: 20rpx;
			left: 30rpx;
			color: rgba(0,0,0,.4);
		}
		.zai-hover-box {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.flex-wrap {
				height: 100%;
				.zai-hover-left {
					height: 100%;
				}
				.zai-hover-centre {
					height: 100%;
				}
				.zai-hover-right {
					height: 100%;
				}
			}
		}
	}
	.V{
		padding: 0.5rem 0;
	}
	.H {
		.zai-content {
			position: absolute;
			top: 0.5rem;
			bottom: 1rem;
			overflow: hidden;
			width: 100%;
			border-top: 0;
			.zai-article {
				height: 100%;
				min-height: 100%;
				.zai-section {
					overflow: visible;
					height: 100%;
					columns: calc(100vw - 55rpx) 1;
					column-gap: 29rpx;
				}
			}
		}
	}
	.zai-opt-box {
		visibility: hidden;
		transition: opacity .15s,visibility .15s;
		opacity: 0;
		z-index: 2;
		.zai-join-book {
			position: absolute;
			top: 1rem;
			right: 0;
			font-size: 0.7rem;
			line-height: 2rem;
			padding: 0 .5rem 0 .75rem;
			transition: color .15s,transform .15s;
			transform: translateX(100%);
			border-radius: 3rem 0 0 3rem;
		}
		.zai-opt-footer {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateY(100%);
			transition: opacity .15s,transform .15s,visibility .15s;
			border-bottom: 0;
		}
		.zai-opt-bot {
			position: absolute;
			right: 0;
			bottom: 100rpx;
			left: 0;
			visibility: hidden;
			transform: translateY(.5px);
			opacity: 0;
			transition: opacity .15s,transform .15s,visibility .15s;
			border-bottom: 2rpx solid rgba(255,255,255,.1);
			.solid-bottom {
				border-bottom: 2rpx solid rgba(255,255,255,.1);
			}
			.btn-skin.default {
				background: url(../../static/img/skin-default-s.png);
				background-size: 100% 100%;
			}
			.btn-skin.blue {
				background: #cad9e8;
			}
			.btn-skin.green {
				background: #d1edd1;	
			}
			.btn-skin.light {
				background: #e6e6e6;
			}
			.btn-skin.night{
				background: #1a1a1a;
			}
		}
	}
	.zai-opt-bot.show {
		visibility: visible;
		transition: none;
		opacity: 1;
	}
	.zai-opt-box.show {
		visibility: visible;
		transition: none;
		opacity: 1;
		.zai-join-book {
			transform: translateX(0);
		}
		.zai-opt-footer {
			transform: translateY(0);
		}
	}
</style>
