<!--章节内容-->
<template>
	<view>
		<!--导航栏-->
		<u-navbar :autoBack="true" :placeholder="true" bgColor="">
			<view slot="right" style="display: flex;">
				<span style="align-self: center;">{{article.article_number}}字</span>
				<view class="iconfont icon-tongbu" @click="Synchronization"></view>
				<view class="iconfont icon-book" style="font-weight: 900;"></view>
				<view class="iconfont icon-Initial" style="font-weight: 900;"@click="TypeSet"></view>
				<view class="iconfont icon-undo" @click="undo"></view>
				<view class="iconfont icon-redo" @click="redo"></view>
				<view class="iconfont icon-gengduo"></view>
			</view>
		</u-navbar>
		<!--文本编辑器 @confirm-->
		<view class="container">
			<view class="page-body">
				<view class='wrapper'>
					<view class="editor-wrapper">
						<editor id="editor" class="ql-container ql-editor" 
						@statuschange="onStatusChange" @input="CountNumber" @keydown.enter="TextIndent"></editor>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				_id: '',
				readOnly: false,
				formats: {},
				article: {
					article_name:'',
					article_content: '',
					article_number: 0
				},
			}
		},
		onLoad(option){
			this._id = option._id;
			this.GetArticle(option._id)
		},
		methods: {
			//获取章节内容
			GetArticle(id){
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'selbyid',
						_id: id
					}
				}).then(res=>{
					console.log(res)
					this.article = res.result.data[0]
					delete this.article._id//删除属性_id，修改不能带_id
					setTimeout(()=>{
						this.onEditorReady();
					},200)
				})
			},
			//文本编辑器初始化
			onEditorReady(e){
				var _self = this
				uni.createSelectorQuery().select('#editor').context((res) => {
				    this.editorCtx = res.context
					this.editorCtx.setContents({
						html: _self.article.article_content
					});
					if(_self.article.article_content==""||_self.article.article_content==null
					||_self.article.article_content==undefined||_self.article.article_content=="<p><br></p>"){
						this.editorCtx.insertText({
							text: "       "
						})
					}
				}).exec()
			},
			//同步内容
			Synchronization(e){
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'upd',
						_id: this._id,
						article: this.article
					}
				}).then(res=>{
					uni.showToast({
						title: '同步成功！',
						icon: 'none'
					})
				})
			},
			//统计字数
			CountNumber(e){
				this.article.article_number = e.detail.text.replace(/<\/?.+?\/?>|\r|\n|\s*/g,"").length
				this.article.article_content = e.detail.html
			},
			//更改样式
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			//自动排版
			TypeSet(){
				// console.log(this.article.article_content)
				// this.article.article_content = this.article.article_content.replaceAll("<p>","<p>        ")
				// this.editorCtx.setContents({
				// 	html: this.article.article_content
				// });
				// console.log(this.article.article_content)
			},
			//首行缩进
			TextIndent(){
				this.editorCtx.insertText({
					text: "       "
				})
			},
			//撤回
			undo() {
				this.editorCtx.undo()
			},
			//重做
			redo() {
				this.editorCtx.redo()
			},
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";
	.page-body {
		height: calc(100vh - var(--window-top) - var(--status-bar-height));
	}
	
	.wrapper {
		height: 100%;
	}
	
	.editor-wrapper {
		height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px);
		background: #fff;
	}
	
	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}
	
	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}
	
	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: 100%;
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
	}
	
	.ql-active {
		color: #06c;
	}
</style>