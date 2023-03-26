<template>
	<view>
		<!-- 模拟的标题 -->
		<image class="header" src="https://www.mescroll.com/img/beibei/header.jpg" mode="aspectFit"/>
		
		<mescroll-body-diy @init="mescrollInit" top="180" bottom="100" @down="downCallback" @up="upCallback">
			<!-- 模拟的内容 -->
			<image src="https://www.mescroll.com/img/beibei/beibei1.jpg" mode="widthFix"/>
			<image src="https://www.mescroll.com/img/beibei/beibei2.jpg" mode="widthFix"/>
			<!-- 分页的数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body-diy>
		
		<!-- 模拟的底部 -->
		<image class="footer" src="https://www.mescroll.com/img/beibei/footer.jpg" mode="aspectFit"/>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import MescrollBodyDiy from "@/uni_modules/mescroll-uni/components/mescroll-diy/beibei/mescroll-body.vue";
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	const goods = ref([]) // 数据列表
	
	// 上拉加载的回调: 其中num:当前页 从1开始, size:每页数据条数,默认10
	const upCallback = (mescroll)=>{
		apiGoods(mescroll.num, mescroll.size).then(res=>{
			const curPageData = res.list || [] // 当前页数据
			if(mescroll.num == 1) goods.value = []; // 第一页需手动制空列表
			goods.value = goods.value.concat(curPageData); // 追加新数据
			mescroll.endSuccess(curPageData.length); // 隐藏加载进度
		}).catch(()=>{
			mescroll.endErr(); // 隐藏加载进度
		})
	}
</script>

<style>
	image{width: 100%;vertical-align: bottom;height:auto}
	.header{z-index: 9900;position: fixed;top: --window-top;left: 0;height: 180upx;background: white;}
	.footer{z-index: 9900;position: fixed;bottom: 0;left: 0;height: 100upx;background: white;}
</style>
