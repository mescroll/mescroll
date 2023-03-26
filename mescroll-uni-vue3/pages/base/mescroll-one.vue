<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip">每次切换菜单及时刷新列表,不缓存数据</view>
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		</view>
		
		<!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		 <mescroll-body @init="mescrollInit" top="120" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	
	const upOption = {
		// page: {
		// 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
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
</script>

<style>
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
</style>
