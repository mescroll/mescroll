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
		 <mescroll-uni @init="mescrollInit" top="365" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 大海报 -->
			<image id="anchorPoint" v-if="tabIndex==0" src="https://www.mescroll.com/img/taobao/taobao3.jpg" mode="widthFix" style="width: 100%"/>
			 
			<!-- 数据列表 -->
			<good-list class="good-comp" :list="goods"></good-list>
		</mescroll-uni>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	// mescroll-uni不用传onPageScroll, onReachBottom
	const { mescrollInit, downCallback, getMescroll } = useMescroll() // 调用mescroll的hook
	
	const upOption = {
		// page: {
		// 	size: 10 // 每页数据的数量
		// },
		noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
		empty:{
			tip: '~ 搜索无数据 ~', // 提示
			btnText: '去看看'
		}
	}
	
	const goods = ref([]) // 数据列表
	
	const tabs = [{name:'全部',type:'xx'}, {name:'奶粉',type:'xx'}, {name:'面膜',type:'xx'}, {name:'图书',type:'xx'}]
	const tabIndex = ref(0) // tab下标
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		let word = tabs[tabIndex.value].name // 具体项目中,您可能取的是tab中的type,status等字段
		apiGoods(mescroll.num, mescroll.size, word).then(res=>{
			const list = res.list || [] // 当前页数据
			if(mescroll.num == 1) goods.value = []; //如果是第一页需手动制空列表
			goods.value = goods.value.concat(list); //追加新数据
			mescroll.endSuccess(list.length); // 请求成功, 结束加载
		}).catch(()=>{
			mescroll.endErr(); // 请求失败, 结束加载
		})
	}
	
	//点击空布局按钮的回调
	const emptyClick = ()=>{
		uni.showToast({
			title:'点击了按钮,具体逻辑自行实现'
		})
	}
	
	// 切换菜单
	const tabChange = ()=> {
		goods.value = []// 先置空列表,显示加载进度
		getMescroll().resetUpScroll() // 再刷新列表数据
	}
	
	// 主动触发下拉刷新
	const triggerDownScroll = ()=> {
		getMescroll().scrollTo(0, 0)
		getMescroll().triggerDownScroll()
	}
	
	// 滚动到指定位置,传数字 (单位px)
	const scrollToY = (y)=> {
		// getMescroll().scrollTo(y) // 过渡动画时长默认300ms
		getMescroll().scrollTo(y, 0) // 无过渡动画
	}
	
	// 滚动到指定view,传view的id
	const scrollIntoView = (viewId)=> {
		// getMescroll().scrollTo(viewId) // 过渡动画时长默认300ms
		getMescroll().scrollTo(viewId, 0) // 无过渡动画
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
