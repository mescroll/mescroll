/**
 * mescroll-more-item的mixins, 仅在多个 mescroll-body 写在子组件时使用 (参考 mescroll-more 案例)
 */
const MescrollMoreItemMixin = {
	props:{
		i: Number, // 每个tab页的专属下标
		index: { // 当前tab的下标
			type: Number,
			default(){
				return 0
			}
		}
	},
	data() {
		return {
			downOption:{
				auto:false // 不自动加载
			},
			upOption:{
				auto:false // 不自动加载
			},
			isInit: false // 当前tab是否已初始化
		}
	},
	watch:{
		// 监听下标的变化
		index(val){
			if (this.i === val && !this.isInit) {
				this.isInit = true; // 标记为true
				this.mescroll && this.mescroll.triggerDownScroll();
			}
		}
	},
	methods: {
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
			this.mescrollInitByRef && this.mescrollInitByRef(); // 兼容字节跳动小程序 (mescroll-mixins.js)
			// 自动加载当前tab的数据
			if(this.i === this.index){
				this.isInit = true; // 标记为true
				this.mescroll.triggerDownScroll();
			}
		},
	}
}

export default MescrollMoreItemMixin;
