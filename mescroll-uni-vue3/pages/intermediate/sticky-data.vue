<!-- 菜单悬浮的原理: 通过给菜单添加position:sticky实现, 用法超简单, 仅APP端的低端机不兼容 https://caniuse.com/#feat=css-sticky -->
<template>
	<view>
		<!-- 对于mescroll-body: 需设置:sticky="true", 此应避免在mescroll-body标签前面加其他非定位的元素, 否则下拉区域会被挤出, 无法会隐藏.-->
		<!-- 对于mescroll-uni: 则无需设置:sticky="true", 无其他限制和要求 -->
		<mescroll-body :sticky="true" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<swiper style="min-height: 300rpx" autoplay="true" interval="3000" duration="300" circular="true">
				<swiper-item>
					<image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
				</swiper-item>
				<swiper-item>
					<image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
				</swiper-item>
			</swiper>
			
			<view class="demo-tip">
				<view>列表只初始化一次,切换菜单缓存数据</view>
				<view>吸顶通过给菜单加position:sticky实现, 用法简单</view>
				<view>小程序,微信h5端: 低端机sticky也可生效, 可放心使用</view>
				<view>APP端: 仅部分低端机无效,若要兼容则参考sticky-scroll</view>
			</view>
			
			<!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
			<view class="sticky-tabs">
				<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
			</view>
			
			<!-- 数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body>
		
		<!-- 此处可以写其他fixed定位元素 -->
		<!-- <view></view> -->
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	
	const tabs = ref([
			{name:'全部', goods: null, num:1, y:0, curPageLen:0, hasNext:true},
			{name:'母婴', goods: null, num:1, y:0, curPageLen:0, hasNext:true},
			{name:'图书', goods: null, num:1, y:0, curPageLen:0, hasNext:true}
		])
	const tabIndex = ref(0) // tab下标
	
	const goods = computed(()=>{
		return tabs.value[tabIndex.value].goods
	})
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		let keyword = tabs.value[tabIndex.value].name;
		apiGoods(mescroll.num, mescroll.size, keyword).then(res=>{
			// 需先隐藏加载状态
			mescroll.endSuccess(res.list.length);
			
			// 当前tab数据
			let curTab = tabs.value[tabIndex.value]
			
			// 设置列表数据
			if(mescroll.num == 1) curTab.goods = []; //如果是第一页需手动制空列表
			curTab.goods = curTab.goods.concat(res.list); //追加新数据
			curTab.num = mescroll.num; // 页码
			curTab.curPageLen = res.list.length; // 当前页长
			curTab.hasNext = mescroll.optUp.hasNext; // 是否还有下一页
		}).catch(()=>{
			//联网失败, 结束加载
			mescroll.endErr();
		})
	}
	
	// 切换菜单
	const preIndex = ref(0)
	const tabChange = (index)=> {
		// 记录切换前滚动条的位置
		const mescroll = getMescroll()
		let preTab = tabs.value[preIndex.value]
		preTab.y = mescroll.getScrollTop()
		preIndex.value = index;
		// 当前菜单的数据
		let curTab = tabs.value[index]
		if (!curTab.goods) {
			// 没有初始化,则初始化
			mescroll.resetUpScroll()
		} else{
			// 初始化过,则恢复之前的列表数据
			mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
			mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
			setTimeout(()=>{
				mescroll.scrollTo(curTab.y, 0) // 恢复滚动条的位置
			},20)
		}
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
		top: var(--window-top);
		background-color: #fff;
	}
	
	// 使用mescroll-uni,则top为0
	.mescroll-uni{
		.sticky-tabs{
			top: 0;
		}
	}
	
	.demo-tip{
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}
</style>
