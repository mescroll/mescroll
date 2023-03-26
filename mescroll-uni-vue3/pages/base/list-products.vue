<template>
	 <mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
		<view class="notice">mescroll的极简示例,大部分情况就是这么用</view>
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const goods = ref([]) // 数据列表
	const { mescrollInit, downCallback } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	
	// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
	const upCallback = (mescroll)=>{
		apiGoods(mescroll.num, mescroll.size).then(res=>{
			const curPageData = res.list || [] // 当前页数据
			if(mescroll.num == 1) goods.value = []; // 第一页需手动制空列表
			goods.value = goods.value.concat(curPageData); //追加新数据
			//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
			//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
			
			//方法一(推荐): 后台接口有返回列表的总页数 totalPage
			//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
			
			//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
			//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
			
			//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
			//mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)
			
			//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据.
			mescroll.endSuccess(curPageData.length); // 请求成功, 结束加载
		}).catch(()=>{
			mescroll.endErr(); // 请求失败, 结束加载
		})
	}
</script>

<style>
	.notice{
		font-size: 26upx;
		padding: 40upx 0;
		border-bottom: 1upx solid #eee;
		text-align: center;
		color:#555;
	}
</style>
