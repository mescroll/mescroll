<template>
	<!-- 系统自带的下拉刷新，只能配合mescroll-body使用， 在mescroll-uni中无效 -->
	<mescroll-body @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
		<view class="tip">系统自带的下拉刷新,性能最好,支持条件编译</view>
		<view class="tip">模拟器和真机效果可能不一样,请用真机测试</view>
		<view class="tip" @click="triggerDownScroll">点此主动触发下拉刷新</view>
		<!-- 菜单 -->
		<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		<!-- 数据列表 -->
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom, onPullDownRefresh) // 调用mescroll的hook
	const downOption = {
		native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
		// 支持条件编译,如您可以配置小程序端使用系统自带的,其他平台使用mescroll的下拉样式
		//ifdef MP
		// native: true
		//endif
		//可在mescroll-uni-option.js全局配置native的值
	}
	const upOption = {
		noMoreSize: 4, 
		empty:{
			tip: '~ 搜索无数据 ~',
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
	const triggerDownScroll = ()=>{
		getMescroll().triggerDownScroll()
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
