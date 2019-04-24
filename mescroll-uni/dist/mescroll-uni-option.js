// mescroll 全局配置
const GlobalOption = {
	down: {
		textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
		textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
		textLoading: '加载中 ...', // 加载中的提示文本
		offset: 80 // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
	},
	up: {
		textLoading: '加载中 ...', // 加载中的提示文本
		textNoMore: '-- END --', // 没有更多数据的提示文本
		toTop: {
			// 回到顶部按钮,需配置src才显示
			src: "http://www.mescroll.com/img/mescroll-totop.png?v=1", // 图片路径 (建议放入static目录, 如 /static/img/mescroll-totop.png )
			offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
			duration: 300, // 回到顶部的动画时长,默认300ms
		},
		empty: {
			use: true, // 是否显示空布局
			icon: "http://www.mescroll.com/img/mescroll-empty.png?v=1", // 图标路径 (建议放入static目录, 如 /static/img/mescroll-empty.png )
			tip: '~ 暂无相关数据 ~' // 提示
		}
	}
}

export default GlobalOption
