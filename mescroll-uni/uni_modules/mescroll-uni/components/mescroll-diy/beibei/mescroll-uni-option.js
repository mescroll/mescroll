// mescroll-uni和mescroll-body 的全局配置
const GlobalOption = {
	down: {
		// 其他down的配置参数也可以写,这里只展示了常用的配置:
		offset: uni.upx2px(140), // 在列表顶部,下拉大于140upx,松手即可触发下拉刷新的回调
		native: false // 是否使用系统自带的下拉刷新; 默认false; 仅在mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
	},
	up: {
		// 其他up的配置参数也可以写,这里只展示了常用的配置:
		offset: 150, // 距底部多远时,触发upCallback
		toTop: {
			// 回到顶部按钮,需配置src才显示
			src: "https://www.mescroll.com/img/mescroll-totop.png", // 图片路径 (建议放入static目录, 如 /static/img/mescroll-totop.png )
			offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000px
			right: 20, // 到右边的距离, 默认20 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
			bottom: 120, // 到底部的距离, 默认120 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
			width: 72 // 回到顶部图标的宽度, 默认72 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
		},
		empty: {
			use: true, // 是否显示空布局
			icon: "https://www.mescroll.com/img/mescroll-empty.png" // 图标路径 (建议放入static目录, 如 /static/img/mescroll-empty.png )
		}
	},
	// 国际化配置
	i18n: {
		// 中文
		zh: {
			up: {
				textLoading: '加载中 ...', // 加载中的提示文本
				textNoMore: '-- END --', // 没有更多数据的提示文本
				empty: {
					tip: '~ 暂无相关数据 ~' // 空提示
				}
			}
		},
		// 英文
		en: {
			up: {
				textLoading: 'loading ...',
				textNoMore: '-- END --',
				empty: {
					tip: '~ absolutely empty ~'
				}
			}
		}
	}
}

export default GlobalOption