<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">基于scroll-view,常用在浮窗弹层等局部滚动区域</view>
			<view class="tip" @click="triggerDownScroll">点此主动触发下拉刷新</view>
			<view class="tip" @click="scrollToY(200)">点此测试滚动到指定位置 (如: 200px)</view>
			<!-- 滚动到本页元素,只需普通的id或class选择器即可 -->
			<view class="tip" @click="scrollIntoView('#anchorPoint')">点此测试滚动到指定view (元素在本页)</view>
			<!-- 滚动到子组件,小程序必须用'跨自定义组件的后代选择器' -->
			<view class="tip" @click="scrollIntoView('.good-comp >>> #good2')">点此测试滚动到指定view (元素在子组件)</view>
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		</view>
		
		<!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		 <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="365" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 大海报 -->
			<image id="anchorPoint" v-if="tabIndex==0" src="http://www.mescroll.com/img/taobao/taobao3.jpg" mode="widthFix" style="width: 100%"/>
			 
			<!-- 数据列表 -->
			<good-list class="good-comp" :list="goods"></good-list>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				upOption:{
					// page: {
					// 	size: 10 // 每页数据的数量
					// },
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ 搜索无数据 ~', // 提示
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
				this.mescroll.scrollTo(0, 0)
				this.mescroll.triggerDownScroll()
			},
			// 滚动到指定位置,传数字 (单位px)
			scrollToY(y){
				// this.mescroll.scrollTo(y) // 过渡动画时长默认300ms
				this.mescroll.scrollTo(y, 0) // 无过渡动画
			},
			// 滚动到指定view,传view的id
			scrollIntoView(viewId){
				// this.mescroll.scrollTo(viewId) // 过渡动画时长默认300ms
				this.mescroll.scrollTo(viewId, 0) // 无过渡动画
			}
		}
	}
</script>

<style>
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 365upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
</style>
