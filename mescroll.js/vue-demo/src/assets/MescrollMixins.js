const MescrollMixins = {
	data() {
		mescroll: null
	},
	beforeRouteEnter(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
		next(vm => {
			// 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
			vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
		})
	},
	beforeRouteLeave(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
		// 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
		this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
		next()
	}
}

export default MescrollMixins
