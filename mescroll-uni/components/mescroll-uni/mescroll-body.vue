<template>
	<view class="mescroll-body" :style="{'minHeight':minHeight, 'padding-top': padTop, 'padding-bottom': padBottom, 'padding-bottom': padBottomConstant, 'padding-bottom': padBottomEnv }" @touchstart="touchstartEvent" @touchmove="touchmoveEvent" @touchend="touchendEvent" @touchcancel="touchendEvent" >
		<view class="mescroll-body-content" :style="{ transform: translateY, transition: transition }">
			<!-- 下拉加载区域 (支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-down组件实现)-->
			<!-- <mescroll-down :option="mescroll.optDown" :type="downLoadType" :rate="downRate"></mescroll-down> -->
			<view v-if="mescroll.optDown.use" class="mescroll-downwarp" :style="{'background-color':mescroll.optDown.bgColor,'color':mescroll.optDown.textColor}">
				<view class="downwarp-content">
					<view class="downwarp-progress" :class="{'mescroll-rotate': isDownLoading}" :style="{'border-color':mescroll.optDown.textColor, 'transform': downRotate}"></view>
					<view class="downwarp-tip">{{downText}}</view>
				</view>
			</view>
	
			<!-- 列表内容 -->
			<slot></slot>

			<!-- 空布局 -->
			<mescroll-empty v-if="isShowEmpty" :option="mescroll.optUp.empty" @emptyclick="emptyClick"></mescroll-empty>

			<!-- 上拉加载区域 (下拉刷新时不显示, 支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-up组件实现)-->
			<!-- <mescroll-up v-if="mescroll.optUp.use && !isDownLoading" :option="mescroll.optUp" :type="upLoadType"></mescroll-up> -->
			<view v-if="mescroll.optUp.use && !isDownLoading" class="mescroll-upwarp" :style="{'background-color':mescroll.optUp.bgColor,'color':mescroll.optUp.textColor}">
				<!-- 加载中 (此处不能用v-if,否则android小程序快速上拉可能会不断触发上拉回调) -->
				<view v-show="upLoadType===1">
					<view class="upwarp-progress mescroll-rotate" :style="{'border-color':mescroll.optUp.textColor}"></view>
					<view class="upwarp-tip">{{ mescroll.optUp.textLoading }}</view>
				</view>
				<!-- 无数据 -->
				<view v-if="upLoadType===2" class="upwarp-nodata">{{ mescroll.optUp.textNoMore }}</view>
			</view>
		</view>

		<!-- 回到顶部按钮 (fixed元素需写在transform外面,防止降级为absolute)-->
		<mescroll-top v-model="isShowToTop" :option="mescroll.optUp.toTop" @click="toTopClick"></mescroll-top>
	</view>
</template>

<script>
	// 引入mescroll-uni.js,处理核心逻辑
	import MeScroll from './mescroll-uni.js';
	// 引入全局配置
	import GlobalOption from './mescroll-uni-option.js';
	// 引入空布局组件
	import MescrollEmpty from './components/mescroll-empty.vue';
	// 引入回到顶部组件
	import MescrollTop from './components/mescroll-top.vue';
	
	export default {
		components: {
			MescrollEmpty,
			MescrollTop
		},
		data() {
			return {
				mescroll: {optDown:{},optUp:{}}, // mescroll实例
				downHight: 0, //下拉刷新: 容器高度
				downRate: 0, // 下拉比率(inOffset: rate<1; outOffset: rate>=1)
				downLoadType: 4, // 下拉刷新状态 （inOffset：1， outOffset：2， showLoading：3， endDownScroll：4）
				upLoadType: 0, // 上拉加载状态：0（loading前），1（loading中），2（没有更多了）
				isShowEmpty: false, // 是否显示空布局
				isShowToTop: false, // 是否显示回到顶部按钮
				windowHeight: 0, // 可使用窗口的高度
				statusBarHeight: 0, // 状态栏高度
				isSafearea: false // 支持安全区
			};
		},
		props: {
			down: Object, // 下拉刷新的参数配置
			up: Object, // 上拉加载的参数配置
			top: [String, Number], // 下拉布局往下的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			topbar: Boolean, // top的偏移量是否加上状态栏高度, 默认false (使用场景:取消原生导航栏时,配置此项可自动加上状态栏高度的偏移量)
			bottom: [String, Number], // 上拉布局往上的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			safearea: Boolean, // bottom的偏移量是否加上底部安全区的距离, 默认false (需要适配iPhoneX时使用)
			height: [String, Number] // 指定mescroll最小高度,默认windowHeight,使列表不满屏仍可下拉
		},
		computed: {
			// mescroll最小高度,默认windowHeight,使列表不满屏仍可下拉
			minHeight(){
				return this.toPx(this.height || '100%') + 'px'
			},
			// 下拉布局往下偏移的距离 (px)
			numTop() {
				return this.toPx(this.top) + (this.topbar ? this.statusBarHeight : 0);
			},
			padTop() {
				return this.numTop + 'px';
			},
			// 上拉布局往上偏移 (px)
			numBottom() {
				return this.toPx(this.bottom);
			},
			padBottom() {
				return this.numBottom + 'px';
			},
			padBottomConstant() {
				return this.isSafearea ? 'calc(' + this.padBottom + ' + constant(safe-area-inset-bottom))' : this.padBottom;
			},
			padBottomEnv() {
				return this.isSafearea ? 'calc(' + this.padBottom + ' + env(safe-area-inset-bottom))' : this.padBottom;
			},
			// 是否为重置下拉的状态
			isDownReset() {
				return this.downLoadType === 3 || this.downLoadType === 4;
			},
			// 过渡
			transition() {
				return this.isDownReset ? 'transform 300ms' : this.downTransition;
			},
			translateY() {
				return this.downHight > 0 ? 'translateY(' + this.downHight + 'px)' : ''; // transform会使fixed失效,需注意把fixed元素写在mescroll之外
			},
			// 是否在加载中
			isDownLoading(){
				return this.downLoadType === 3
			},
			// 旋转的角度
			downRotate(){
				return 'rotate(' + 360 * this.downRate + 'deg)'
			},
			// 文本提示
			downText(){
				switch (this.downLoadType){
					case 1: return this.mescroll.optDown.textInOffset;
					case 2: return this.mescroll.optDown.textOutOffset;
					case 3: return this.mescroll.optDown.textLoading;
					case 4: return this.mescroll.optDown.textLoading;
					default: return this.mescroll.optDown.textInOffset;
				}
			}
		},
		methods: {
			//number,rpx,upx,px,% --> px的数值
			toPx(num) {
				if (typeof num === 'string') {
					if (num.indexOf('px') !== -1) {
						if (num.indexOf('rpx') !== -1) {
							// "10rpx"
							num = num.replace('rpx', '');
						} else if (num.indexOf('upx') !== -1) {
							// "10upx"
							num = num.replace('upx', '');
						} else {
							// "10px"
							return Number(num.replace('px', ''));
						}
					} else if (num.indexOf('%') !== -1) {
						// 传百分比,则相对于windowHeight,传"10%"则等于windowHeight的10%
						let rate = Number(num.replace('%', '')) / 100;
						return this.windowHeight * rate;
					}
				}
				return num ? uni.upx2px(Number(num)) : 0;
			},
			//注册列表touchstart事件,用于下拉刷新
			touchstartEvent(e) {
				this.mescroll.touchstartEvent(e);
			},
			//注册列表touchmove事件,用于下拉刷新
			touchmoveEvent(e) {
				this.mescroll.touchmoveEvent(e);
			},
			//注册列表touchend事件,用于下拉刷新
			touchendEvent(e) {
				this.mescroll.touchendEvent(e);
			},
			// 点击空布局的按钮回调
			emptyClick() {
				this.$emit('emptyclick', this.mescroll);
			},
			// 点击回到顶部的按钮回调
			toTopClick() {
				this.mescroll.scrollTo(0, this.mescroll.optUp.toTop.duration); // 执行回到顶部
				this.$emit('topclick', this.mescroll); // 派发点击回到顶部按钮的回调
			}
		},
		// 使用created初始化mescroll对象; 如果用mounted部分css样式编译到H5会失效
		created() {
			let vm = this;

			let diyOption = {
				// 下拉刷新的配置
				down: {
					inOffset(mescroll) {
						vm.downLoadType = 1; // 下拉的距离进入offset范围内那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					outOffset(mescroll) {
						vm.downLoadType = 2; // 下拉的距离大于offset那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					onMoving(mescroll, rate, downHight) {
						// 下拉过程中的回调,滑动过程一直在执行;
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
						vm.downRate = rate; //下拉比率 (inOffset: rate<1; outOffset: rate>=1)
					},
					showLoading(mescroll, downHight) {
						vm.downLoadType = 3; // 显示下拉刷新进度的回调 (自定义mescroll组件时,此行不可删)
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					endDownScroll(mescroll) {
						vm.downLoadType = 4; // 结束下拉 (自定义mescroll组件时,此行不可删)
						vm.downHight = 0; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					// 派发下拉刷新的回调
					callback: function(mescroll) {
						vm.$emit('down', mescroll);
					}
				},
				// 上拉加载的配置
				up: {
					// 显示加载中的回调
					showLoading() {
						vm.upLoadType = 1;
					},
					// 显示无更多数据的回调
					showNoMore() {
						vm.upLoadType = 2;
					},
					// 隐藏上拉加载的回调
					hideUpScroll() {
						vm.upLoadType = 0;
					},
					// 空布局
					empty: {
						onShow(isShow) {
							// 显示隐藏的回调
							vm.isShowEmpty = isShow;
						}
					},
					// 回到顶部
					toTop: {
						onShow(isShow) {
							// 显示隐藏的回调
							vm.isShowToTop = isShow;
						}
					},
					// 派发上拉加载的回调
					callback: function(mescroll) {
						vm.$emit('up', mescroll);
					}
				}
			};

			MeScroll.extend(diyOption, GlobalOption); // 混入全局的配置
			let myOption = JSON.parse(
				JSON.stringify({
					down: vm.down,
					up: vm.up
				})
			); // 深拷贝,避免对props的影响
			MeScroll.extend(myOption, diyOption); // 混入具体界面的配置

			// 初始化MeScroll对象
			vm.mescroll = new MeScroll(myOption, true); // 传入true,标记body为滚动区域
			// init回调mescroll对象
			vm.$emit('init', vm.mescroll);

			// 设置高度
			const sys = uni.getSystemInfoSync();
			if (sys.windowHeight) vm.windowHeight = sys.windowHeight;
			if (sys.statusBarHeight) vm.statusBarHeight = sys.statusBarHeight;
			// 使down的bottomOffset生效
			vm.mescroll.setBodyHeight(sys.windowHeight);
			// mescroll-body在Android小程序下拉会卡顿,无法像mescroll-uni那样通过设置"disableScroll":true解决,只能用动画过渡缓解
			// #ifdef MP
			if(sys.platform == "android") vm.downTransition = 'transform 200ms'
			// #endif

			// 因为使用的是page的scroll,这里需自定义scrollTo
			vm.mescroll.resetScrollTo((y, t) => {
				uni.pageScrollTo({
					scrollTop: y,
					duration: t
				})
			});

			// 具体的界面如果不配置up.toTop.safearea,则取本vue的safearea值
			if(sys.platform == "ios"){
				vm.isSafearea = vm.safearea;
				if (vm.up && vm.up.toTop && vm.up.toTop.safearea != null) {} else {
					vm.mescroll.optUp.toTop.safearea = vm.safearea;
				}
			}else{
				vm.isSafearea = false
				vm.mescroll.optUp.toTop.safearea = false
			}
		}
	};
</script>

<style>
	@import "./mescroll-body.css";
	@import "./components/mescroll-down.css";
	@import './components/mescroll-up.css';
</style>
