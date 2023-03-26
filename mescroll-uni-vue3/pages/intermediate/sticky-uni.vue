<template>
	<view>
		<mescroll-uni @init="mescrollInit" @down="downCallback" @up="upCallback">
			<swiper style="height: 300rpx" autoplay="true" interval="3000" duration="300" circular="true">
				<swiper-item>
					<image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
				</swiper-item>
				<swiper-item>
					<image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
				</swiper-item>
			</swiper>
			
			<view class="demo-tip">
				<view>仅测试mescroll-uni使用sticky的情况</view>
				<view>与mescroll-body使用的区别:</view>
				<view>1. mescroll-uni 无需配置 :sticky="true"</view>
				<view>2. sticky的top 无需考虑var(--window-top)</view>
			</view>
			
			<!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
			<view class="sticky-tabs">
				<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
			</view>
			
			<!-- 数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-uni>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	// mescroll-uni不用传onPageScroll, onReachBottom
	const { mescrollInit, downCallback, getMescroll } = useMescroll() // 调用mescroll的hook
	
	const goods = ref([]) // 数据列表
	
	const tabs = [{name:'全部',type:'xx'}, {name:'母婴',type:'xx'}, {name:'图书',type:'xx'}]
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
	
	// 切换菜单
	const tabChange = ()=> {
		goods.value = []// 先置空列表,显示加载进度
		getMescroll().resetUpScroll() // 再刷新列表数据
	}
</script>

<style lang="scss">
	/*
	sticky生效条件：
	1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	3、父元素的高度不能低于sticky元素的高度
	4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	*/
	.sticky-tabs{
		z-index: 990;
		position: sticky;
		top: 0;
		background-color: #fff;
	}
	
	.demo-tip{
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}
</style>
