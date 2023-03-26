<template>
	<view 
		class="mescroll-body mescroll-render-touch" 
		:style="{'minHeight':minHeight, 'padding-top': padTop, 'padding-bottom': padBottom}" 
		:class="{'mescorll-sticky': sticky}"
		@touchstart="wxsBiz.touchstartEvent" 
		@touchmove="wxsBiz.touchmoveEvent" 
		@touchend="wxsBiz.touchendEvent" 
		@touchcancel="wxsBiz.touchendEvent"
		:change:prop="wxsBiz.propObserver"
		:prop="wxsProp"
		>
		
		<!-- 状态栏 -->
		<view v-if="topbar&&statusBarHeight" class="mescroll-topbar" :style="{height: statusBarHeight+'px', background: topbar}"></view>

		<view class="mescroll-body-content mescroll-wxs-content" :style="{ transform: translateY, transition: transition }" :change:prop="wxsBiz.callObserver" :prop="callProp">
			<!-- 下拉加载区域 (支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-down组件实现)-->
			<!-- <mescroll-down :option="mescroll.optDown" :type="downLoadType"></mescroll-down> -->
			<view v-if="mescroll.optDown.use" class="mescroll-downwarp" :style="{'background':mescroll.optDown.bgColor,'color':mescroll.optDown.textColor}">
				<view class="downwarp-content">
					<image class="downwarp-slogan" src="https://www.mescroll.com/img/beibei/mescroll-slogan.jpg?v=1" mode="widthFix"/>
					<view v-if="isDownLoading" class="downwarp-loading mescroll-rotate"></view>
					<view v-else class="downwarp-progress" :style="{'transform':downRotate}"></view>
					<view class="downwarp-mascot"></view>
				</view>
			</view>
						
			<!-- 列表内容 -->
			<slot></slot>

			<!-- 空布局 -->
			<mescroll-empty v-if="isShowEmpty" :option="mescroll.optUp.empty" @emptyclick="emptyClick"></mescroll-empty>

			<!-- 上拉加载区域 (下拉刷新时不显示, 支付宝小程序子组件传参给子子组件仍报单项数据流的异常,暂时不通过mescroll-up组件实现)-->
			<!-- <mescroll-up v-if="mescroll.optUp.use && !isDownLoading && upLoadType!==3" :option="mescroll.optUp" :type="upLoadType"></mescroll-up> -->
			<view v-if="mescroll.optUp.use && !isDownLoading && upLoadType!==3" class="mescroll-upwarp" :style="{'background':mescroll.optUp.bgColor,'color':mescroll.optUp.textColor}">
				<!-- 加载中 (此处不能用v-if,否则android小程序快速上拉可能会不断触发上拉回调) -->
				<view v-show="upLoadType===1">
					<view class="upwarp-progress mescroll-rotate" :style="{'border-color':mescroll.optUp.textColor}"></view>
					<view class="upwarp-tip">{{ mescroll.optUp.textLoading }}</view>
				</view>
				<!-- 无数据 -->
				<view v-if="upLoadType===2" class="upwarp-nodata">{{ mescroll.optUp.textNoMore }}</view>
			</view>
		</view>
		
		<!-- 底部是否偏移TabBar的高度(仅H5端生效) -->
		<!-- #ifdef H5 -->
		<view v-if="bottombar && windowBottom>0" class="mescroll-bottombar" :style="{height: windowBottom+'px'}"></view>
		<!-- #endif -->
		
		<!-- 适配iPhoneX -->
		<view v-if="safearea" class="mescroll-safearea"></view>
		
		<!-- 回到顶部按钮 (fixed元素需写在transform外面,防止降级为absolute)-->
		<mescroll-top v-model="isShowToTop" :option="mescroll.optUp.toTop" @click="toTopClick"></mescroll-top>

		<!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS || H5 -->
		<!-- renderjs的数据载体,不可写在mescroll-downwarp内部,避免use为false时,载体丢失,无法更新数据 -->
		<view :change:prop="renderBiz.propObserver" :prop="wxsProp"></view>
		<!-- #endif -->
	</view>
</template>

<!-- 微信小程序, QQ小程序, app, h5使用wxs -->
<!-- #ifdef MP-WEIXIN || MP-QQ || APP-PLUS || H5 -->
<script src="../../mescroll-uni/wxs/wxs.wxs" module="wxsBiz" lang="wxs"></script>
<!-- #endif -->

<!-- app, h5使用renderjs -->
<!-- #ifdef APP-PLUS || H5 -->
<script module="renderBiz" lang="renderjs">
	import renderBiz from '../../mescroll-uni/wxs/renderjs.js';
	export default {
		mixins: [renderBiz]
	}
</script>
<!-- #endif -->

<script>
	import MeScroll from '../../mescroll-uni/mescroll-uni.js';
	import MescrollTop from '../../mescroll-uni/components/mescroll-top.vue';
	import WxsMixin from '../../mescroll-uni/wxs/mixins.js';
	import mescrollI18n from '../../mescroll-uni/mescroll-i18n.js';
	import GlobalOption from './mescroll-uni-option.js';
	
	export default {
		mixins: [WxsMixin],
		components: {
			MescrollTop
		},
		data() {
			return {
				mescroll: {optDown:{},optUp:{}}, // mescroll实例
				downHight: 0, //下拉刷新: 容器高度
				downLoadType: 0, // 下拉刷新状态: 0(loading前), 1(inOffset), 2(outOffset), 3(showLoading), 4(endDownScroll)
				upLoadType: 0, // 上拉加载状态：0（loading前），1（loading中），2（没有更多了,显示END文本提示），3（没有更多了,不显示END文本提示）
				isShowEmpty: false, // 是否显示空布局
				isShowToTop: false, // 是否显示回到顶部按钮
				windowHeight: 0, // 可使用窗口的高度
				windowBottom: 0, // 可使用窗口的底部位置
				statusBarHeight: 0 // 状态栏高度
			};
		},
		props: {
			down: Object, // 下拉刷新的参数配置
			up: Object, // 上拉加载的参数配置
			i18n: Object, // 国际化的参数配置
			top: [String, Number], // 下拉布局往下的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			topbar: [Boolean, String], // top的偏移量是否加上状态栏高度, 默认false (使用场景:取消原生导航栏时,配置此项可留出状态栏的占位, 支持传入字符串背景,如色值,背景图,渐变)
			bottom: [String, Number], // 上拉布局往上的偏移量 (支持20, "20rpx", "20px", "20%"格式的值, 其中纯数字则默认单位rpx, 百分比则相对于windowHeight)
			safearea: Boolean, // bottom的偏移量是否加上底部安全区的距离, 默认false (需要适配iPhoneX时使用)
			height: [String, Number], // 指定mescroll最小高度,默认windowHeight,使列表不满屏仍可下拉
			bottombar:{ // 底部是否偏移TabBar的高度(默认仅在H5端的tab页生效)
				type: Boolean,
				default: true
			},
			sticky: Boolean // 是否支持sticky,默认false; 当值配置true时,需避免在mescroll-body标签前面加非定位的元素,否则下拉区域无法会隐藏
		},
		computed: {
			// mescroll最小高度,默认windowHeight,使列表不满屏仍可下拉
			minHeight(){
				return this.toPx(this.height || '100%') + 'px'
			},
			// 下拉布局往下偏移的距离 (px)
			numTop() {
				return this.toPx(this.top)
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
			// 是否为重置下拉的状态
			isDownReset() {
				return this.downLoadType === 3 || this.downLoadType === 4;
			},
			// 过渡
			transition() {
				return this.isDownReset ? 'transform 300ms' : '';
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
				return this.downLoadType === 2 ? 'rotate(180deg)' : 'rotate(0deg)'
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
					inOffset() {
						vm.downLoadType = 1; // 下拉的距离进入offset范围内那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					outOffset() {
						vm.downLoadType = 2; // 下拉的距离大于offset那一刻的回调 (自定义mescroll组件时,此行不可删)
					},
					onMoving(mescroll, rate, downHight) {
						// 下拉过程中的回调,滑动过程一直在执行;
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					showLoading(mescroll, downHight) {
						vm.downLoadType = 3; // 显示下拉刷新进度的回调 (自定义mescroll组件时,此行不可删)
						vm.downHight = downHight; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
					},
					endDownScroll() {
						vm.downLoadType = 4; // 结束下拉 (自定义mescroll组件时,此行不可删)
						vm.downHight = 0; // 设置下拉区域的高度 (自定义mescroll组件时,此行不可删)
						if(vm.downResetTimer) {clearTimeout(vm.downResetTimer); vm.downResetTimer = null} // 移除重置倒计时
						vm.downResetTimer = setTimeout(()=>{ // 过渡动画执行完毕后,需重置为0的状态,避免下次inOffset不及时显示textInOffset
							if(vm.downLoadType === 4) vm.downLoadType = 0
						},300)
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
					hideUpScroll(mescroll) {
						vm.upLoadType = mescroll.optUp.hasNext ? 0 : 3;
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

			let i18nType = mescrollI18n.getType() // 当前语言类型
			let i18nOption = {type: i18nType} // 国际化配置
			MeScroll.extend(i18nOption, vm.i18n) // 具体页面的国际化配置
			MeScroll.extend(i18nOption, GlobalOption.i18n) // 全局的国际化配置
			MeScroll.extend(diyOption, i18nOption[i18nType]); // 混入国际化配置
			MeScroll.extend(diyOption, {down:GlobalOption.down, up:GlobalOption.up}); // 混入全局的配置
			let myOption = JSON.parse(JSON.stringify({down: vm.down,up: vm.up})); // 深拷贝,避免对props的影响
			MeScroll.extend(myOption, diyOption); // 混入具体界面的配置

			// 初始化MeScroll对象
			vm.mescroll = new MeScroll(myOption, true); // 传入true,标记body为滚动区域
			// 挂载语言包
			vm.mescroll.i18n = i18nOption;
			// init回调mescroll对象
			vm.$emit('init', vm.mescroll);

			// 设置高度
			const sys = uni.getSystemInfoSync();
			if (sys.windowHeight) vm.windowHeight = sys.windowHeight;
			if (sys.windowBottom) vm.windowBottom = sys.windowBottom;
			if (sys.statusBarHeight) vm.statusBarHeight = sys.statusBarHeight;
			// 使down的bottomOffset生效
			vm.mescroll.setBodyHeight(sys.windowHeight);

			// 因为使用的是page的scroll,这里需自定义scrollTo
			vm.mescroll.resetScrollTo((y, t) => {
				if(typeof y === 'string'){
					// 滚动到指定view (y为css选择器)
					setTimeout(()=>{ // 延时确保view已渲染; 不使用$nextTick
						let selector;
						if(y.indexOf('#')==-1 && y.indexOf('.')==-1){
							selector = '#'+y // 不带#和. 则默认为id选择器
						}else{
							selector = y
							// #ifdef APP-PLUS || H5 || MP-ALIPAY || MP-DINGTALK
							if(y.indexOf('>>>')!=-1){ // 不支持跨自定义组件的后代选择器 (转为普通的选择器即可跨组件查询)
								selector = y.split('>>>')[1].trim()
							}
							// #endif
						}
						uni.createSelectorQuery().select(selector).boundingClientRect(function(rect){
							if (rect) {
								let top = rect.top
								top += vm.mescroll.getScrollTop()
								uni.pageScrollTo({
									scrollTop: top,
									duration: t
								})
							} else{
								console.error(selector + ' does not exist');
							}
						}).exec()
					},30)
				} else{
					// 滚动到指定位置 (y必须为数字)
					uni.pageScrollTo({
						scrollTop: y,
						duration: t
					})
				}
			});

			// 具体的界面如果不配置up.toTop.safearea,则取本vue的safearea值
			if (vm.up && vm.up.toTop && vm.up.toTop.safearea != null) {} else {
				vm.mescroll.optUp.toTop.safearea = vm.safearea;
			}
			
			// 全局配置监听
			uni.$on("setMescrollGlobalOption", options=>{
				if(!options) return;
				let i18nType = options.i18n ? options.i18n.type : null
				if(i18nType && vm.mescroll.i18n.type != i18nType){
					vm.mescroll.i18n.type = i18nType
					mescrollI18n.setType(i18nType)
					MeScroll.extend(options, vm.mescroll.i18n[i18nType])
				}
				if(options.down){
					let down = MeScroll.extend({}, options.down)
					vm.mescroll.optDown = MeScroll.extend(down, vm.mescroll.optDown)
				}
				if(options.up){
					let up = MeScroll.extend({}, options.up)
					vm.mescroll.optUp = MeScroll.extend(up, vm.mescroll.optUp)
				}
			})
		},
		destroyed() {
			// 注销全局配置监听
			uni.$off("setMescrollGlobalOption")
		}
	};
</script>

<style>
	@import "../../mescroll-body/mescroll-body.css";
	@import "../../mescroll-uni/components/mescroll-down.css";
	@import "../../mescroll-uni/components/mescroll-up.css";
	@import "./components/mescroll-down.css";
</style>
