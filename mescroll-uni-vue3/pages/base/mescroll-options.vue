<template>
	<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" 
	 :down="downOption" 
	 :up="upOption" 
	 :top="0" 
	 :bottom="0" 
	 :topbar="false" 
	 :bottombar="true" 
	 :fixed="true" 
	 height="100%" 
	 :safearea="false" 
	 :sticky="true"
	 @emptyclick="emptyClick" 
	 @topclick="topClick" 
	 @scroll="scroll">
	 
		<view class="tip">展示down和up的所有配置项</view>
		<view class="tip" @click="triggerDownScroll">点此主动触发下拉刷新</view>
		<view class="tip" @click="scrollToY(200)">点此测试滚动到指定位置 (如: 200px)</view>
		<!-- 滚动到本页元素,只需普通的id或class选择器即可 -->
		<view class="tip" @click="scrollIntoView('#anchorPoint')" id="anchorPoint">点此测试滚动到指定view (元素在本页)</view>
		<!-- 滚动到子组件,小程序必须用'跨自定义组件的后代选择器' -->
		<view class="tip" @click="scrollIntoView('.good-comp >>> #good2')">点此测试滚动到指定view (元素在子组件)</view>
		
		<!-- sticky吸顶悬浮的菜单 (父元素必须是 mescroll, 且mescroll配置:sticky="true") -->
		<view class="sticky-tabs">
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		</view>
		
		<!-- 视频请尽量使用me-video组件 (video在APP中是原生组件, 真机APP端下拉渲染不及时.) -->
		<!-- 使用me-video组件, 未播放时自动展示image封面, 播放时才显示video, 提高性能; 当加上 :mescroll="mescroll"之后, 如果播放中执行下拉,会自动隐藏视频,显示封面,避免视频下拉悬浮错位(仅APP端这样处理) -->
		<me-video v-if="tabIndex==0" :mescroll="mescroll" poster="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-mescroll/2e3cd7a0-f31a-11ea-81ea-f115fe74321c.png" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-mescroll/2ae5d090-f26e-11ea-81ea-f115fe74321c.mp4"></me-video>
		
		<!-- 商品组件 -->
		<good-list class="good-comp" :list="goods"></good-list>
	</mescroll-body>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const { mescrollInit, downCallback, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	const mescroll = computed(()=>getMescroll()) // 必须使用计算属性才可及时获取到mescroll对象,此处是me-video中使用
	
	const downOption = {
		use: true, // 是否启用下拉刷新; 默认true
		auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
		native: false, // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
		autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
		isLock: false, // 是否锁定下拉刷新,默认false;
		offset: 80, // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
		inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
		outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
		bottomOffset: 20, // 当手指touchmove位置在距离body底部20upx范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
		minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
		beforeEndDelay: 0, // 延时结束的时长 (显示加载成功/失败的时长, android小程序设置此项结束下拉会卡顿, 配置后请注意测试)
		bgColor: "#E75A7C", // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
		textColor: "#fff", // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
		textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
		textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
		textLoading: '加载中 ...' // 加载中的提示文本
	}
	const upOption = {
		use: true, // 是否启用上拉加载; 默认true
		auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
		isLock: false, // 是否锁定上拉加载,默认false;
		isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认true,两者可同时触发;
		page: {
			num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
			size: 10, // 每页数据的数量
			time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
		},
		noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
		offset: 80, // 距底部多远时,触发upCallback(仅mescroll-uni生效, 对于mescroll-body则需在pages.json设置"onReachBottomDistance")
		bgColor: "transparent", // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
		textColor: "gray", // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
		textLoading: '加载中 ...', // 加载中的提示文本
		textNoMore: '-- END --', // 没有更多数据的提示文本
		toTop: {
			// 回到顶部按钮,需配置src才显示
			src: "https://www.mescroll.com/img/mescroll-totop.png", // 图片路径
			offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
			duration: 300, // 回到顶部的动画时长,默认300ms (当值为0或300则使用系统自带回到顶部,更流畅; 其他值则通过step模拟,部分机型可能不够流畅,所以非特殊情况不建议修改此项)
			zIndex: 9990, // fixed定位z-index值
			left: null, // 到左边的距离, 默认null. 此项有值时,right不生效. (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
			right: 20, // 到右边的距离, 默认20 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
			bottom: 120, // 到底部的距离, 默认120 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
			safearea: false, // bottom的偏移量是否加上底部安全区的距离, 默认false, 需要适配iPhoneX时使用 (具体的界面如果不配置此项,则取mescroll组件props的safearea值)
			width: 72, // 回到顶部图标的宽度, 默认72 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
			radius: "50%" // 圆角, 默认"50%" (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx)
		},
		empty: {
			use: true, // 是否显示空布局
			icon: "https://www.mescroll.com/img/mescroll-empty.png", // 图标路径
			tip: '~ 暂无相关数据 ~', // 提示
			btnText: '去逛逛 >', // 按钮
			fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
			top: "100rpx", // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
			zIndex: 99 // fixed定位z-index值
		},
		onScroll: true // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
	}
	
	
	const goods = ref([]) // 数据列表
	
	const tabs = [{name:'全部',type:'xx'}, {name:'奶粉',type:'xx'}, {name:'图书',type:'xx'}]
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
	
	// 点击回到顶部按钮的回调
	const topClick = ()=> {
		console.log('点击了回到顶部按钮');
	}
	
	// mescroll-uni滚动事件 (需在up配置onScroll:true才生效, mescroll-body直接声明onPageScroll)
	const scroll = ()=> {
		const mescroll = getMescroll()
		console.log('mescroll元素id: '+mescroll.viewId+' , 滚动内容高度:'+mescroll.getScrollHeight() + ', mescroll高度:'+mescroll.getClientHeight() + ', 滚动条位置:'+mescroll.getScrollTop() + ', 距离底部:'+mescroll.getScrollBottom() + ', 是否向上滑:'+mescroll.isScrollUp)
	}
	
	// 主动触发下拉刷新
	const triggerDownScroll = ()=> {
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
	
	// mescroll-body的滚动事件是页面的滚动事件
	onPageScroll(e=>{
		console.log("mescroll-body的滚动事件e.scrollTop=" + e.scrollTop)
	})
</script>

<style>
	.tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
	
	.sticky-tabs{
		z-index: 990;
		position: sticky;
		top: var(--window-top);
		background-color: #fff;
	}
</style>
