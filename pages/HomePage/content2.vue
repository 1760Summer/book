<!--章节内容-->
<template>
	<view class="home">
		<!--导航栏-->
		<u-navbar :autoBack="true" :placeholder="true" bgColor="">
			<view slot="right" style="display: flex;">
				<span style="align-self: center; margin-right: 20px;">{{article.article_number}}字</span>
				<span style="align-self: center;" @click="Synchronization">存档</span>
			</view>
		</u-navbar>
	    <view class="editor-box">
	      <sp-editor
	        :toolbar-config="{
	          excludeKeys: ['direction', 'date', 'lineHeight', 'letterSpacing', 'listCheck'],
	          iconSize: '18px',
	        }"
	        @init="initEditor"
	        @input="inputOver"
	        @overMax="overMax"
			@addLink="addLink"
			@exportHtml="exportHtml"
	      ></sp-editor>
	    </view>
	  </view>
</template>

<script>
	export default {
		data() {
			return{
				_id: '',
				editorIns: null,
				article: {
					article_name:'',
					article_content: '',
					article_number: 0
				},
			}
		},
		onLoad(option){
			this._id = option._id;
		},
		onShow(){
			this.GetArticle()
		},
		methods: {
			//获取章节内容
			GetArticle(){
				uniCloud.callFunction({
					name: 'Article',
					data:{
						type: 'selbyid',
						_id: this._id
					}
				}).then(res=>{
					this.article = res.result.data[0]
					delete this.article._id//删除属性_id，修改不能带_id
				})
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
						title: '存档成功！',
						icon: 'none'
					})
				})
			},
			//统计字数
			CountNumber(e){
				this.article.article_number = e.detail.text.replace(/<\/?.+?\/?>|\r|\n|\s*/g,"").length
				this.article.article_content = e.detail.html
			},
			//已编辑的内容
			inputOver(e) {
			    // 可以在此处获取到编辑器已编辑的内容
			    console.log("==== inputOver :", e);
			},
			//超出最大限制
			overMax(e) {
			    // 若设置了最大字数限制，可在此处触发超出限制的回调
			    console.log("==== overMax :", e);
			},
			//初始化编辑器
			initEditor(editor) {
			    this.editorIns = editor; // 保存编辑器实例
			    // 保存编辑器实例后，可以在此处获取后端数据，并赋值给编辑器初始化内容
			    this.preRender();
			},
			preRender() {
			    setTimeout(() => {
				// 异步获取后端数据后，初始化编辑器内容
					this.editorIns.setContents({
					  html: this.article.article_content,
					});
			    }, 1000);
			},
			//超链接
			addLink(e) {
			    console.log("==== addLink :", e);
			},
			//导出
			exportHtml(e) {
			    uni.navigateTo({
					url: "/pages/out/out",
					success(res) {
					  // 传至导出页面解析即可
					    res.eventChannel.emit("e-transmit-html", {
							data: e,
					    });
					},
			    });
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