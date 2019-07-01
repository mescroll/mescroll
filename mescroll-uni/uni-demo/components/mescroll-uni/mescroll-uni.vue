<template>
	<view class="mescroll-uni-warp">
		<scroll-view :class="{'mescroll-uni':true, 'mescroll-uni-fixed':fixed}" :style="{'padding-top':padTop,'padding-bottom':padBottom,'top':fixedTop,'bottom':fixedBottom}" :lower-threshold="upOffset" :scroll-top="scrollTop" :scroll-with-animation="scrollAnim" @scroll="scroll" @scrolltolower="scrolltolower" @touchstart="touchstartEvent" @touchmove="touchmoveEvent" @touchend="touchendEvent" @touchcancel="touchendEvent" :scroll-y='scrollAble' :enable-back-to-top="true">
			<!-- 下拉加载区域 (部分css样式需写成style,否则编译到浏览器会丢失,坐等HBuilderX优化编译器..)-->
			<view v-if="optDown" class="mescroll-downwarp" :class="{'mescroll-downwarp-reset':isDownReset}" :style="{'height': downHight+'px', 'position': 'relative', 'overflow': 'hidden', '-webkit-transition': isDownReset?'height 300ms':''}">
				<view class="downwarp-content" style="text-align: center;position: absolute;left: 0;bottom: 0;width: 100%;padding: 20upx 0;">
					<view class="downwarp-progress" :style="{'transform':'rotate(' + downRotate + 'deg)'}" :class="{'mescroll-rotate':isDownLoading}"></view>
					<view class="downwarp-tip">{{downText}}</view>
				</view>
			</view>
			
			<!-- 列表内容 -->
			<slot></slot>
			
			<!-- 空布局 -->
			<view v-if="optEmpty&&isShowEmpty" :class="{'mescroll-empty':true,'empty-fixed':optEmpty.fixed}" :style="{'z-index':optEmpty.zIndex,'top':optEmpty.top}">
				<image v-if="optEmpty.icon" class="empty-icon" :src="optEmpty.icon" mode="widthFix" />
				<view v-if="optEmpty.tip" class="empty-tip">{{optEmpty.tip}}</view>
				<view v-if="optEmpty.btnText" class="empty-btn" @click="emptyClick">{{optEmpty.btnText}}</view>
			</view>
		
			<!-- 上拉加载区域 -->
			<view v-if="optUp" class="mescroll-upwarp">
				<!-- 加载中.. -->
				<template v-if="isUpLoading">
					<view class="upwarp-progress mescroll-rotate"></view>
					<view class="upwarp-tip">{{optUp.textLoading}}</view>
				</template>
				<!-- 无数据 -->
				<view v-if="!isDownLoading && isUpNoMore" class="upwarp-nodata">{{optUp.textNoMore}}</view>
			</view>
			
		</scroll-view>
		
		<!-- 回到顶部按钮 (fixed元素,需写在scroll-view外面,防止滚动的时候抖动)-->
		<image v-if="optToTop" class="mescroll-totop" :class="{'mescroll-fade-in':isShowToTop}" :src="optToTop.src" mode="widthFix" @click="toTopClick" />
	</view>
</template>

<script>
	// 引入mescroll-uni.js,处理核心逻辑
	import MeScroll from './mescroll-uni.js';
	// 引入全局配置
	import GlobalOption from './mescroll-uni-option.js';

	export default {
		data() {
			return {
				mescroll: null, // mescroll实例
				downHight: 0, //下拉刷新: 容器高度
				downRotate: 0, //下拉刷新: 圆形进度条旋转的角度
				downText: '', //下拉刷新: 提示的文本
				isDownReset: false, //下拉刷新: 是否显示重置的过渡动画
				isDownLoading: false, //下拉刷新: 是否显示加载中
				isUpLoading: false, // 上拉加载: 是否显示 "加载中..."
				isUpNoMore: false, // 上拉加载: 是否显示 "-- END --"
				isShowEmpty: false, // 是否显示空布局
				isShowToTop: false, // 是否显示回到顶部按钮
				scrollAble: true, // 是否禁止下滑 (下拉时禁止,避免抖动)
				scrollTop: 0, // 滚动条的位置
				scrollAnim: false, // 是否开启滚动动画
				windowTop: 0, // 可使用窗口的顶部位置
				windowBottom: 0 // 可使用窗口的底部位置
			}
		},
		props: {
			down: Object, // 下拉刷新的参数配置
			up: Object, // 上拉加载的参数配置
			top: [String,Number],  // padding-top的数值,单位upx. 目的是使下拉布局往下偏移
			bottom: [String,Number],  // padding-bottom的数值,单位upx. 目的是使上拉布局往上偏移
			fixed: { // 是否通过fixed固定mescroll的高度, 默认true
				type: Boolean,
				default(){
					return true
				}
			}
		},
		computed: {
			// 下拉刷新的配置
			optDown() {
				return this.mescroll ? this.mescroll.optDown : null;
			},
			// 上拉加载的配置
			optUp() {
				return this.mescroll ? this.mescroll.optUp : null;
			},
			// 空布局的配置
			optEmpty() {
				return this.mescroll ? this.mescroll.optUp.empty : null;
			},
			// 回到顶部的配置
			optToTop() {
				return this.mescroll ? this.mescroll.optUp.toTop : null;
			},
			// top数值,单位upx,需转成px. 目的是使下拉布局往下偏移
			numTop(){
				return uni.upx2px(Number(this.top||0))
			},
			fixedTop(){
				return this.fixed ? (this.numTop + this.windowTop) + 'px' : 0
			},
			padTop(){
				return !this.fixed ? this.numTop + 'px' : 0
			},
			// bottom数值,单位upx,需转成px 目的是使上拉布局往上偏移
			numBottom(){
				return uni.upx2px(Number(this.bottom||0))
			},
			fixedBottom(){
				return this.fixed ? (this.numBottom + this.windowBottom) + 'px' : 0
			},
			padBottom(){
				return !this.fixed ? this.numBottom + 'px' : 0
			},
			// 距底部多远时（单位px），触发 scrolltolower 事件
			upOffset(){
				return this.mescroll ? this.mescroll.optUp.offset : 50;
			}
		},
		methods: {
			//注册滚动到底部的事件,用于上拉加载
			scrolltolower() {
				this.mescroll && this.mescroll.scrolltolower();
			},
			//注册列表滚动事件,用于下拉刷新
			scroll(e) {
				this.mescroll && this.mescroll.scroll(e.detail, ()=>{
					this.$emit('scroll', this.mescroll) // 此时可直接通过 this.mescroll.scrollTop获取滚动条位置; this.mescroll.isScrollUp获取是否向上滑动
				})
			},
			//注册列表touchstart事件,用于下拉刷新
			touchstartEvent(e) {
				this.mescroll && this.mescroll.touchstartEvent(e);
			},
			//注册列表touchmove事件,用于下拉刷新
			touchmoveEvent(e) {
				this.mescroll && this.mescroll.touchmoveEvent(e);
			},
			//注册列表touchend事件,用于下拉刷新
			touchendEvent(e) {
				this.mescroll && this.mescroll.touchendEvent(e);
			},
			// 点击空布局的按钮回调
			emptyClick(){
				this.$emit('emptyclick',this.mescroll)
			},
			// 点击回到顶部的按钮回调
			toTopClick(){
				this.isShowToTop = false; // 回到顶部按钮需要先隐藏,再执行回到顶部,避免闪动
				this.mescroll.scrollTo(0, this.mescroll.optUp.toTop.duration); // 执行回到顶部
				this.$emit('topclick', this.mescroll); // 派发点击回到顶部按钮的回调
			}
		},
		// 编译到H5,不会执行onReady,只执行mounted
		mounted() {
			let vm = this;
			
			let diyOption = {
				// 下拉刷新的配置
				down: {
					inOffset(mescroll) {
						// 下拉的距离进入offset范围内那一刻的回调
						vm.scrollAble = false; // 禁止下拉,避免抖动 (自定义mescroll组件时,此行不可删)
						vm.isDownReset = false; // 不重置高度 (自定义mescroll组件时,此行不可删)
						vm.isDownLoading = false; // 不显示加载中
						vm.downText = mescroll.optDown.textInOffset; // 设置文本
					},
					outOffset(mescroll) {
						// 下拉的距离大于offset那一刻的回调
						vm.scrollAble = false; // 禁止下拉,避免抖动 (自定义mescroll组件时,此行不可删)
						vm.isDownReset = false; // 不重置高度 (自定义mescroll组件时,此行不可删)
						vm.isDownLoading = false; // 不显示加载中
						vm.downText = mescroll.optDown.textOutOffset; // 设置文本
					},
					onMoving(mescroll, rate, downHight) {
						// 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
						vm.downRotate = 360 * rate; // 设置旋转角度
					},
					showLoading(mescroll, downHight) {
						// 显示下拉刷新进度的回调
						vm.scrollAble = true; // 开启下拉 (自定义mescroll组件时,此行不可删)
						vm.isDownReset = true; // 重置高度 (自定义mescroll组件时,此行不可删)
						vm.isDownLoading = true;// 显示加载中
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
						vm.downText = mescroll.optDown.textLoading; // 设置文本
					},
					endDownScroll(mescroll) {
						vm.scrollAble = true;// 开启下拉 (自定义mescroll组件时,此行不可删)
						vm.isDownReset = true;// 重置高度 (自定义mescroll组件时,此行不可删)
						vm.isDownLoading = false; // 不显示加载中
						vm.downHight = 0; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					// 派发下拉刷新的回调
					callback: function(mescroll){
						vm.$emit('down', mescroll)
					}
				},
				// 上拉加载的配置
				up: {
					// 显示加载中的回调
					showLoading() {
						vm.isUpLoading = true;
						vm.isUpNoMore = false;
					},
					// 显示无更多数据的回调
					showNoMore() {
						vm.isUpLoading = false;
						vm.isUpNoMore = true;
					},
					// 隐藏上拉加载的回调
					hideUpScroll() {
						vm.isUpLoading = false;
						vm.isUpNoMore = false;
					},
					// 空布局
					empty: {
						onShow(isShow) { // 显示隐藏的回调
							if(vm.isShowEmpty != isShow) vm.isShowEmpty = isShow;
						}
					},
					// 回到顶部
					toTop: {
						onShow(isShow) { // 显示隐藏的回调
							if (vm.isShowToTop != isShow) vm.isShowToTop = isShow;
						}
					},
					// 派发上拉加载的回调
					callback: function(mescroll){
						vm.$emit('up', mescroll)
					}
				}
			}
			
			MeScroll.extend(diyOption, GlobalOption); // 混入全局的配置
			let myOption = MeScroll.extend({
				'down': vm.down ? JSON.parse(JSON.stringify(vm.down)) : vm.down, // 深拷贝,避免对props的影响
				'up': vm.up ? JSON.parse(JSON.stringify(vm.up)) : vm.up // 深拷贝,避免对props的影响
			}, diyOption); // 混入具体界面的配置
			
			// 初始化MeScroll对象
			vm.mescroll = new MeScroll(myOption);
			// init回调mescroll对象
			vm.$emit('init', vm.mescroll);
			
			// 设置高度
			uni.getSystemInfo({
				success(res) {
					if(res.windowTop) vm.windowTop = res.windowTop; // 修正app和H5的top值
					if(res.windowBottom) vm.windowBottom = res.windowBottom; // 修正app和H5的bottom值
					vm.mescroll.setBodyHeight(res.windowHeight); // 使down的bottomOffset生效
				}
			});
			
			// 因为使用的是scrollview,这里需自定义scrollTo
			vm.mescroll.resetScrollTo((y, t)=>{
				let curY = vm.mescroll.getScrollTop()
				if (t === 0) {
					vm.scrollAnim = false;
					vm.scrollTop = curY;
					vm.$nextTick(function(){
						vm.scrollTop = y
					})
				} else{
					vm.scrollAnim = true;
					vm.mescroll.getStep(curY, y, step=>{ // 此写法可支持配置t
						vm.scrollTop = step
					}, t)
				}
			})
			
		}
	}
</script>

<style>
	@import "./mescroll-uni.css";
</style>
