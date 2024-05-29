<script>
	import {mapState,mapMutations} from 'vuex';
	export default {
		methods: {
			...mapMutations(['UserLogin']),
		},
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			//判断是否有保存的登录信息
			let _self = this;
			uni.getStorage({
				key: 'userInfo',
				success(res) {
					if(res.data.user_tel){
						_self.UserLogin(res.data)
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@font-face {
		  font-family: 'iconfont' ;  /* project id 1997429 */
		  src: url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.eot');
		  src: url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.eot?#iefix') format('embedded-opentype'),
		  url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.woff2') format('woff2'),
		  url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.woff') format('woff'),
		  url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.ttf') format('truetype'),
		  url('https://at.alicdn.com/t/font_1997429_8xzvctxta3u.svg#iconfont') format('svg');
	}
	.iconfont{
	    font-family:"iconfont" !important;
		font-style:normal;
	    -webkit-font-smoothing: antialiased;
	    -webkit-text-stroke-width: 0.2px;
	    -moz-osx-font-smoothing: grayscale;
	}
	*,view{
		box-sizing: border-box;
	}
	
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uview-ui/index.scss";
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
