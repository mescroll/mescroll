<template>
	<!-- 系统自带的下拉刷新，只能配合mescroll-body使用， 在mescroll-uni中无效 -->
	<mescroll-body ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
		<view class="tip">系统自带的下拉刷新,性能最好,支持条件编译</view>
		<view class="tip">模拟器和真机效果可能不一样,请用真机测试</view>
		<view class="tip" @click="triggerDownScroll">点此主动触发下拉刷新</view>
		<!-- 菜单 -->
		<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		<!-- 数据列表 -->
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件，内部已注册onPullDownRefresh)
		data() {
			return {
				downOption:{
					native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
					
					// 支持条件编译,如您可以配置小程序端使用系统自带的,其他平台使用mescroll的下拉样式
					//ifdef MP
					// native: true
					//endif
					//可在mescroll-uni-option.js全局配置native的值
				},
				upOption:{
					noMoreSize: 4, 
					empty:{
						tip: '~ 搜索无数据 ~',
						btnText: '去看看'
					}
				},
				goods: [], //列表数据
				tabs: ['全部', '奶粉', '面膜', '图书'],
				tabIndex: 0 // tab下标
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let keyword = this.tabs[this.tabIndex]
				apiSearch(page.num, page.size, keyword).then(curPageData=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(curPageData); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			
			// 切换菜单
			tabChange() {
				this.goods = []// 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			
			// 主动触发下拉刷新
			triggerDownScroll(){
				this.mescroll.triggerDownScroll()
			}
		}
	}
</script>

<style>
	.tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
</style>
