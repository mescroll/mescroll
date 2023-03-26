<!-- tab组件: <me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs> -->
<template>
	<view class="me-tabs" :class="{'tabs-fixed': fixed}" :style="{height: tabHeightVal, top:topFixed, 'margin-top':topMargin}">
		<scroll-view v-if="tabs.length" :id="viewId" :scroll-left="scrollLeft" scroll-x scroll-with-animation :scroll-animation-duration="300">
			<view class="tabs-item" :class="{'tabs-flex':!isScroll, 'tabs-scroll':isScroll}">
				<!-- tab -->
				<view class="tab-item" :style="{width: tabWidthVal, height: tabHeightVal, 'line-height':tabHeightVal}" v-for="(tab, i) in tabs" :class="{'active': value===i}" :key="i" @click="tabClick(i)">
					{{getTabName(tab)}}
				</view>
				<!-- 下划线 -->
				<view class="tabs-line" :style="{left:lineLeft}"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			tabs: { // 支持格式: ['全部', '待付款'] 或 [{name:'全部'}, {name:'待付款'}]
				type: Array,
				default(){
					return []
				}
			},
			nameKey: { // 取name的字段
				type: String,
				default: 'name'
			},
			value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
				type: [String, Number],
				default: 0
			},
			fixed: Boolean, // 是否悬浮,默认false
			tabWidth: Number, // 每个tab的宽度,默认不设置值,为flex平均分配; 如果指定宽度,则不使用flex,每个tab居左,超过则水平滑动(单位默认rpx)
			height: { // 高度,单位rpx
				type: Number,
				default: 64
			},
			top: { // 顶部偏移的距离,默认单位rpx (当fixed=true时,已加上windowTop)
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				viewId: 'id_' + Math.random().toString(36).substr(2,16),
				scrollLeft: 0,
				windowWidth: 0,
				windowTop: 0
			}
		},
		computed: {
			isScroll(){
				return this.tabWidth && this.tabs.length // 指定了tabWidth的宽度,则支持水平滑动
			},
			tabHeightPx(){
				return uni.upx2px(this.height)
			},
			tabHeightVal(){
				return this.tabHeightPx+'px'
			},
			tabWidthPx(){
				return uni.upx2px(this.tabWidth)
			},
			tabWidthVal(){
				return this.isScroll ? this.tabWidthPx+'px' : ''
			},
			lineLeft() {
				if (this.isScroll) {
					return this.tabWidthPx * this.value + this.tabWidthPx/2 + 'px' // 需转为px (用rpx的话iOS真机显示有误差)
				} else{
					return 100/this.tabs.length*(this.value + 1) - 100/(this.tabs.length*2) + '%'
				}
			},
			topFixed(){
				return this.fixed ? this.windowTop + uni.upx2px(this.top) + 'px' : 0
			},
			topMargin(){
				return this.fixed ? 0 : this.top + 'rpx'
			}
		},
		watch: {
			tabs() {
				// 水平滚动到中间
				this.initWarpRect(()=>{
					this.scrollCenter()
				})
			},
			value() {
				this.scrollCenter(); // 水平滚动到中间
			}
		},
		created() {
			let sys = uni.getSystemInfoSync();
			this.windowWidth = sys.windowWidth
			this.windowTop = sys.windowTop
		},
		mounted() {
			// 滚动到当前下标
			this.initWarpRect(()=>{
				this.scrollCenter()
			})
		},
		methods: {
			getTabName(tab){
				return typeof tab === "object" ? tab[this.nameKey] : tab
			},
			tabClick(i){
				if(this.value!=i){
					this.$emit("input",i);
					this.$emit("change",i);
				}
			},
			scrollCenter(){
				if(!this.isScroll) return;
				let tabLeft = this.tabWidthPx * this.value + this.tabWidthPx/2; // 当前tab中心点到左边的距离
				let diff = tabLeft - this.warpWidth/2 // 如果超过tabs容器的一半,则滚动差值
				this.scrollLeft = diff;
			},
			initWarpRect(success){
				setTimeout(()=>{ // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery().in(this);
					query.select('#'+this.viewId).boundingClientRect(rect => {
						this.warpWidth = rect ? rect.width : this.windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
						success()
					}).exec();
				},20)
			}
		}
	}
</script>

<style lang="scss">
	.me-tabs{
		position: relative;
		font-size: 24rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		box-sizing: border-box;
		overflow-y: hidden;
		background-color: #fff;
		&.tabs-fixed{
			z-index: 990;
			position: fixed;
			left: 0;
			width: 100%;
		}
		
		.tabs-item{
			position: relative;
			white-space: nowrap;
			padding-bottom: 30rpx; // 撑开高度,再配合me-tabs的overflow-y: hidden,以达到隐藏滚动条的目的
			box-sizing: border-box;
			.tab-item{
				position: relative;
				text-align: center;
				box-sizing: border-box;
				&.active{
					font-weight: bold;
					color: red;
				}
			}
		}
		
		// 平分的方式显示item
		.tabs-flex{
			display: flex;
			.tab-item{
				flex: 1;
			}
		}
		// 居左显示item,支持水平滑动
		.tabs-scroll{
			.tab-item{
				display: inline-block;
			}
		}
		
		// 选中tab的线
		.tabs-line{
			z-index: 1;
			position: absolute;
			bottom: 30rpx; // 至少与.tabs-item的padding-bottom一致,才能保证在底部边缘
			width: 50rpx;
			height: 6rpx;
			transform: translateX(-50%);
			border-radius: 4rpx;
			transition: left .3s;
			background: red;
		}
	}
</style>
