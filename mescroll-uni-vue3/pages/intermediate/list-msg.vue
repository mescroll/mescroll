<template>
	<!-- 需配置bottom的偏移量, 用于底部留白 -->
	<mescroll-body bottom="50%" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption">
		<!-- 无更多消息 -->
		<view v-if="isEnd" class="msg-end">没有更多消息了</view>
		
		<!-- 消息列表 (必须配置id,以便定位) -->
		<view class="msg" v-for="msg in msgList" :key="msg.id" :id="msg.VIEW_ID" :class="[msg.id%2==0 ? 'right' : 'left']">
			<view class="msg-warp">
				<view class="msg-title">{{msg.title}}</view>
				<view class="msg-content">{{msg.content}}</view>
			</view>
		</view>
	</mescroll-body>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useMescroll from "@/uni_modules/mescroll-uni/hooks/useMescroll.js";
	import {apiMsgList} from "@/api/mock.js"
	
	const { mescrollInit, getMescroll } = useMescroll(onPageScroll, onReachBottom) // 调用mescroll的hook
	
	const downOption = {
		autoShowLoading: true, // 显示下拉刷新的进度条
		textColor: "#FF8095" // 下拉刷新的文本颜色
	}
	const upOption = {
		use: false, // 禁止上拉
		toTop: {
			src: '' // 不显示回到顶部按钮
		}
	}
	const pageNum = ref(1) // 页码
	const pageSize = ref(10) // 页长
	const isEnd = ref(false) // 是否无消息
	const msgList = ref([])
	
	/* 自定义下拉刷新的回调,不使用useMescroll的downCallback */
	const downCallback = (mescroll)=> {
		//联网加载数据
		apiMsgList(pageNum.value, pageSize.value).then(data => {
			// 需自行维护页码
			pageNum.value ++;
			// 先隐藏下拉刷新的状态
			mescroll.endSuccess();
			// 不满一页,说明已经无更多消息 (建议根据您实际接口返回的总页码数,总消息量,是否有消息的字段来判断)
			if(data.length < pageSize.value){
				isEnd.value = true; // 标记已无更多消息
				mescroll.lockDownScroll(true); // 锁定下拉
			}
			// 生成VIEW_ID,大写,避免污染源数据
			data.forEach(val=>{
				val.VIEW_ID = "msg" + val.id // 不以数字开头
			})
			
			// 获取当前最顶部的VIEW_ID (注意是写在data.concat前面)
			let topMsg = msgList.value[0]
			
			//设置列表数据
			msgList.value = data.concat(msgList.value); // 注意不是msgList.concat
			
			setTimeout(()=>{
				if(pageNum.value <= 2){
					// 第一页直接滚动到底部 ( pageNum已在前面加1 )
					mescroll.scrollTo(99999, 0)
				}else if(topMsg){
					// 保持顶部消息的位置
					let view = uni.createSelectorQuery().select('#'+topMsg.VIEW_ID);
					view.boundingClientRect(v => {
						console.log("节点离页面顶部的距离=" + v.top);
						mescroll.scrollTo(v.top - 100, 0) // 减去上偏移量100
					}).exec();
				}
			},20)
			
		}).catch(()=>{
			pageNum.value --; // 联网失败,必须回减页码
			mescroll.endErr(); // 隐藏下拉刷新的状态
		})
	}
</script>

<style lang="scss">
	/* 无更多消息 */
	.msg-end{
		padding: 40rpx 0;
		font-size: 24rpx;
		text-align: center;
		color: #FF8095;
	}
	/*消息列表*/
	.msg{
		margin: 30rpx;
		&.right{
			text-align: right;
		}
		&.left{
			text-align: left;
		}
		.msg-warp{
			width: 50%;
			display: inline-block;
			padding: 30rpx;
			border-radius: 30rpx;
			background-color: #FF8095;
			color: #fff;
			.msg-title{
				margin-left: -12rpx;
				font-size: 32rpx;
				text-align: left;
			}
			.msg-content{
				font-size: 26rpx;
				margin-top: 10rpx;
				text-align: left;
			}
		}
	}
</style>
