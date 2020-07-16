<template>
	<!-- mescroll-uni本质是scroll-view,支持局部区域滚动,可使用flex布局灵活的嵌在某个view中, 而mescroll-body只能靠fixed定位其他元素变相实现'局部滚动' -->
	<view class="page-warp">
		
		<view class="top-warp">
			<view>顶部区域</view>
			<view style="font-size: 24rpx;">mescroll-uni 支持局部区域滚动,支持使用flex嵌在某个view</view>
		</view>
		
		<view class="center-warp">
			<!-- 左边 -->
			<scroll-view class="left-warp" :scroll-y="true">
				<view class="tab" :class="{active:i==tabIndex}" v-for="(tab,i) in tabs" :key="i" @click="tabChange(i)">{{tab}}</view>
			</scroll-view>
			
			<view class="right-warp">
				<!--右边 :fixed="false", 高度跟随父元素 (不在组件上定义class,避免部分小程序平台编译丢失, 如支付宝,钉钉小程序) -->
				<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<good-list :list="goods"></good-list>
				</mescroll-uni>
			</view>
		</view>
		
		<view class="bottom-warp"> 底部区域 </view>
		
	</view>
</template>


<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {apiSearch} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				goods: [], // 数据列表
				tabs: ['全部', '奶粉', '面膜', '图书', '果汁', '奶瓶', '美素', '花王', '韩蜜', '口红', '毛巾', '玩具', '衣服'],
				tabIndex: 0 // tab下标
			}
		},
		methods: {
			upCallback(page) {
				//联网加载数据
				let keyword = this.tabs[this.tabIndex]
				apiSearch(page.num, page.size, keyword).then(curPageData=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(curPageData.length);
					//设置列表数据
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(curPageData); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			// 切换菜单
			tabChange(i){
				if(this.tabIndex != i){
					this.tabIndex = i
					this.goods = []; // 先置空列表,显示加载进度条
					this.mescroll.resetUpScroll(); // 重置列表数据
				}
			}
		}
	}
</script>


<style lang="scss">
	/*根元素需要有固定的高度*/
	page{
		height: 100%;
		// 支付宝小程序,钉钉小程序需添加绝对定位,否则height:100%失效: https://opendocs.alipay.com/mini/framework/acss#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98
		/* #ifdef MP-ALIPAY || MP-DINGTALK*/
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* #endif */
		
		/*需给父元素设置height:100%*/
		.page-warp{
			height: 100%;
			display: flex;
			flex-direction: column;
			
			/* 顶部区域 */
			.top-warp{
				font-size: 28rpx;
				padding: 20rpx;
				text-align: center;
				background-color: #CFE0DA;
			}
			
			/* 中间 */
			.center-warp{
				flex: 1;
				min-width: 0;
				min-height: 0;/* 需给flex:1的元素加上最小高,否则内容超过会溢出容器 (如:小程序Android真机) */
				border: 4px solid red;
				display: flex;
				
				// 左边
				.left-warp{
					width: 180rpx;
					height: 100%;
					background-color: #eee;
					.tab{
						font-size: 28rpx;
						padding: 28rpx;
						&.active{
							background-color: #fff;
						}
					}
				}
				
				// 右边
				.right-warp{
					flex: 1;
					min-width: 0;
				}
			}
			
			/* 底部区域 */
			.bottom-warp{
				padding: 20rpx;
				text-align: center;
				background-color: #FF6990;
			}
		}
	}
</style>