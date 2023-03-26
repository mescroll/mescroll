// 国际化工具类
const mescrollI18n = {
	// 默认语言
	def: "zh",
	// 获取当前语言类型
	getType(){
		return uni.getStorageSync("mescroll-i18n") || this.def
	},
	// 设置当前语言类型
	setType(type){
		uni.setStorageSync("mescroll-i18n", type)
	}
}

export default mescrollI18n
