<template>
	<!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标 )-->
	<view v-show="i === index">
		<!-- top="120"下拉布局往下偏移,防止被悬浮菜单遮住 -->
		<mescroll-body @init="mescrollInit" top="120" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<!-- 数据列表 -->
			<good-list :list="goods"></good-list>
		</mescroll-body>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiGoods} from "@/api/mock.js"
	
	const props = defineProps({
		i: Number, // 每个tab页的专属下标
		index: { // 当前tab的下标
			type: Number,
			default(){
				return 0
			}
		},
		tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
			type: Array,
			default(){
				return []
			}
		}
	})
	
	// 子组件的mescroll-body无需传入onPageScroll, onReachBottom
	const { mescrollInit, downCallback, getMescroll } = useMescroll() // 调用mescroll的hook
	
	defineExpose({ getMescroll }) // 使父组件可以通过ref调用到getMescroll方法 (必须)
	
	const isAutoInit = props.i === props.index // 自动加载当前tab的数据
	const downOption = {
		auto: isAutoInit // 自动加载当前tab的数据
	}
	
	const upOption = {
		auto:false, // 不自动加载
		noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
		empty:{
			tip: '~ 空空如也 ~', // 提示
			btnText: '去看看'
		}
	}
	
	const isInit = ref(isAutoInit) // 当前tab是否已初始化
	const goods = ref([]) // 数据列表
	
	// 监听下标的变化
	watch(
	()=> props.index, 
	(val)=>{
		if (props.i === val && !isInit.value) mescrollTrigger()
	})
	
	// 主动触发加载
	const mescrollTrigger = ()=>{
		isInit.value = true; // 标记为true
		const mescroll = getMescroll()
		if (mescroll) {
			if (mescroll.optDown.use) {
				mescroll.triggerDownScroll();
			} else{
				mescroll.triggerUpScroll();
			}
		}
	}
	
	/*上拉加载的回调: 其中mescroll.num:当前页 从1开始, mescroll.size:每页数据条数,默认10 */
	const upCallback = (mescroll)=>{
		let word = props.tabs[props.i].name // 具体项目中,您可能取的是tab中的type,status等字段
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
</script>
