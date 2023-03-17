import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: {},
		hasLogin: false,
	},
	mutations: {
		UserLogin(state, provider){
			//debugger
			if(provider.user_tel!=undefined){
				state.hasLogin = true
				state.userInfo = provider;
				if(!state.userInfo.user_picture){
					state.userInfo.user_picture = "/static/img/userHL.png"
				}
				if(!state.userInfo.user_name){
					state.userInfo.user_name="已登录"
				}
				uni.setStorageSync('userInfo',provider);
			}
		},
		UserLogout(state){
			state.hasLogin = false
			state.userInfo = {}
			//清除缓存
			uni.removeStorageSync('userInfo');//登录信息
		}
	}
})
export default store;