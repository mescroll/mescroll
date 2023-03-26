<!-- 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏, 用法比sticky复杂, 但APP端可兼容低端机 -->
<template>
	<view>
		<!-- 菜单 (悬浮,预先隐藏)-->
		<me-tabs v-if="isShowSticky" v-model="tabIndex" :fixed="true" :tabs="tabs" @change="tabChange"></me-tabs>
		
		 <mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" @scroll="scroll" @topclick="topClick">
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
				<view>列表只初始化一次,切换菜单缓存数据</view>
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
	const preIndex = ref(0) // 前一个菜单下标
	const navTop = ref(null) // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
	const isShowSticky = ref(false) // 是否悬浮
	const isChangeTab = ref(false) // tab是否切换
	
	const goods = computed(()=>{
		return tabs.value[tabIndex.value].goods
	})
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		//联网加载数据
		if(isChangeTab.value){
			mescroll.hideUpScroll(); // 切换菜单,不显示mescroll进度, 显示系统进度条
			uni.showLoading();
		}
		let keyword = tabs.value[tabIndex.value].name;
		apiGoods(mescroll.num, mescroll.size, keyword).then(res=>{
			//联网成功的回调
			
			// 当前tab数据
			let curTab = tabs.value[tabIndex.value]
			
			//设置列表数据
			if(mescroll.num == 1) curTab.goods = []; //如果是第一页需手动制空列表
			curTab.goods=curTab.goods.concat(res.list); //追加新数据
			
			// 数据渲染完毕再隐藏加载状态 $nextTick在iOS真机不触发,需改成setTimeout
			// $nextTick(()=>{
			setTimeout(()=>{
				// 需先隐藏加载状态
				mescroll.endSuccess(res.list.length);
				
				// 再记录当前页的数据
				curTab.num = mescroll.num; // 页码
				curTab.curPageLen = res.list.length; // 当前页长
				curTab.hasNext = mescroll.optUp.hasNext; // 是否还有下一页
				
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
		const mescroll = getMescroll()
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
	const tabChange = (index)=> {
		// 记录前一个菜单的数据
		const mescroll = getMescroll()
		let preTab = tabs.value[preIndex.value]
		preTab.y = mescroll.getScrollTop(); // 滚动条位置
		preIndex.value = index;
		// 当前菜单的数据
		let curTab = tabs.value[index]
		if (!curTab.goods) {
			// 没有初始化,则初始化
			isChangeTab.value = true;
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
