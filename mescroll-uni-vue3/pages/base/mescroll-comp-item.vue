<template>
	<!-- 当mescroll-body写在子组件时,父页面需引入useMescrollComp.js -->
	<mescroll-body top="100" @init="mescrollInit" @down="downCallback" @up="upCallback">
		<!-- 数据列表 -->
		<good-list :list="goods"></good-list>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const goods = ref([]) // 数据列表
	
	// 子组件的mescroll-body无需传入onPageScroll, onReachBottom
	const { mescrollInit, downCallback, getMescroll } = useMescroll() // 调用mescroll的hook
	
	// 使父组件可以通过ref调用到getMescroll方法 (必须)
	defineExpose({ getMescroll })
	
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
