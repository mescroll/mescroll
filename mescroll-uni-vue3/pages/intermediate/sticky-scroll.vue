<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏, 用法比sticky复杂, 但APP端可兼容低端机 -->
<template>
	<view>
		<!-- 菜单 (悬浮,预先隐藏)-->
		<me-tabs v-if="isShowSticky" v-model="tabIndex" :fixed="true" :tabs="tabs" @change="tabChange"></me-tabs>
		
		 <mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scroll" @topclick="topClick">
			<!--轮播-->
			<swiper style="height: 300rpx" autoplay="true" interval="3000" duration="300" circular="true">
		        <swiper-item>
		            <image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper1.jpg" mode="widthFix"/>
		        </swiper-item>
				<swiper-item>
		            <image style="width: 100%;height: 300rpx;" src="https://www.mescroll.com/img/swiper2.jpg" mode="widthFix"/>
		        </swiper-item>
		    </swiper>
			
			<view class="demo-tip">
				<view>每次切换菜单都刷新列表数据</view>
				<view>吸顶通过监听滚动条实现, 比sticky复杂, 但APP端可兼容低端机</view>
			</view>
			
			<!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
			<view id="tabInList">
				<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
			</view>
			
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
	
	const goods = ref([]) // 数据列表
	
	const tabs = [{name:'全部',type:'xx'}, {name:'奶粉',type:'xx'}, {name:'图书',type:'xx'}]
	const tabIndex = ref(0) // tab下标
	const upOption = {
				// 如果用mescroll-uni 则需要onScroll: true, 且需要 @scroll="scroll"; 而mescroll-body最简单只需在onPageScroll处理即可
				// onScroll: true // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
			}
	
	const navTop = ref(null) // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
	const isShowSticky = ref(false) // 是否悬浮
	const isChangeTab = ref(false) // 是否切换tab
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		//联网加载数据
		if(isChangeTab.value){
			mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
			uni.showLoading();
		}
		let curTab = tabs[tabIndex.value]
		let keyword = curTab.name // 具体项目中,您可能取的是tab中的type,status等字段
		apiGoods(mescroll.num, mescroll.size, keyword).then(res=>{
			//设置列表数据
			if(mescroll.num == 1) goods.value = []; //如果是第一页需手动制空列表
			goods.value = goods.value.concat(res.list); //追加新数据
			
			// 数据渲染完毕再隐藏加载状态 $nextTick在iOS真机不触发,需改成setTimeout
			// $nextTick(()=>{
			setTimeout(()=>{
				mescroll.endSuccess(res.list.length);
				// 设置nav到顶部的距离 (需根据自身的情况获取navTop的值, 这里放到列表数据渲染完毕之后)
				// 也可以放到onReady里面,或者菜单顶部的数据(轮播等)加载完毕之后..
				if(!navTop.value) setNavTop()
				// 保持tab悬浮,列表数据显示第一条
				if(isChangeTab.value){
					isChangeTab.value = false;
					uni.hideLoading();
					if(isShowSticky.value) mescroll.scrollTo(navTop.value, 0)
				}
			},20)
		}).catch(()=>{
			//联网失败, 结束加载
			mescroll.endErr();
		})
	}
	
	// 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的navTop数值是最精确的)
	const setNavTop = ()=>{
		let view = uni.createSelectorQuery().select('#tabInList');
		view.boundingClientRect(data => {
			console.log('tabInList基本信息 = ' + JSON.stringify(data));
			navTop.value = data.top // 到屏幕顶部的距离
		}).exec();
	}
	
	// mescroll-uni的滚动事件 (需在up配置onScroll:true才生效)
	// 而mescroll-body最简单只需在onPageScroll处理即可
	const scroll = ()=>{
		console.log('滚动条位置 = ' + mescroll.getScrollTop() + ', navTop = ' + navTop.value);
		// 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏
		if (mescroll.getScrollTop() >= navTop.value) {
			isShowSticky.value = true // 显示悬浮菜单
		} else {
			isShowSticky.value = false // 隐藏悬浮菜单
		}
	}
	
	// 点击回到顶部按钮时,先隐藏悬浮菜单,避免闪动
	const topClick = ()=>{
		isShowSticky.value = false
	}
	
	// 切换菜单
	const tabChange = ()=>{
		isChangeTab.value = true;
		getMescroll().resetUpScroll()
	}
		
	// 使用mescroll-body最简单只需在onPageScroll处理即可
	onPageScroll(e=>{
		console.log('滚动条位置 = ' + e.scrollTop + ', navTop = ' + navTop.value);
		if (e.scrollTop >= navTop.value) {
			isShowSticky.value = true // 显示悬浮菜单
		} else {
			isShowSticky.value = false // 隐藏悬浮菜单
		}
	})
</script>

<style>
	.demo-tip{
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}
</style>
