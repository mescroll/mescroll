/**
 * mescroll-more-item的mixins, 仅在多个 mescroll-body 写在子组件时使用 (参考 mescroll-more 案例)
 */
const MescrollMoreItemMixin = {
	// 支付宝小程序不支持props的mixin,需写在具体的页面中
	// #ifndef MP-ALIPAY || MP-DINGTALK
	props:{
		i: Number, // 每个tab页的专属下标
		index: { // 当前tab的下标
			type: Number,
			default(){
				return 0
			}
		}
	},
	// #endif
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
		// 以ref的方式初始化mescroll对象 (兼容字节跳动小程序)
		mescrollInitByRef() {
			if(!this.mescroll || !this.mescroll.resetUpScroll){
				// 字节跳动小程序编辑器不支持一个页面存在相同的ref, 多mescroll的ref需动态生成, 格式为'mescrollRef下标'
				let mescrollRef = this.$refs.mescrollRef || this.$refs['mescrollRef'+this.i];
				if(mescrollRef) this.mescroll = mescrollRef.mescroll
			}
		},
		// mescroll组件初始化的回调,可获取到mescroll对象 (覆盖mescroll-mixins.js的mescrollInit, 为了标记isInit)
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
			this.mescrollInitByRef && this.mescrollInitByRef(); // 兼容字节跳动小程序
			// 自动加载当前tab的数据
			if(this.i === this.index){
				this.isInit = true; // 标记为true
				this.mescroll.triggerDownScroll();
			}
		},
	}
}

export default MescrollMoreItemMixin;
