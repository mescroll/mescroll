<!-- 视频组件: <me-video src="视频地址" poster="封面图"></me-video> 
video标签在APP端是原生组件, 真机APP端下拉时会渲染不及时, 出现悬浮错位现象;
me-video组件, 未播放时自动展示image封面, 播放时才显示video, 提高性能; 如果播放中执行下拉,会自动显示封面, 避免视频下拉悬浮错位;
-->
<template>
	<view class="me-video" :style="{width:width, height:height}">
		<!-- 播放的时候才渲染video标签 -->
		<video v-if="showVideo" ref="videoRef" class="video" :class="{'full-play': fullplay&&!autoplay, 'mescroll-dowload': mescrollDownLoad}" :src="src" autoplay :loop="loop" @click="videoClick" x5-playsinline="true" x5-video-player-type="h5" playsinline="true" webkit-playsinline="true" x5-video-player-fullscreen="false"></video>
		<!-- 播放按钮 -->
		<view v-else class="btn-play"> <view class="triangle"></view> </view>
		<!-- 封面 -->
		<image v-if="(!showVideo || mescrollDownLoad) && poster" class="poster" :src="poster" @click="play()" mode="aspectFit"></image>
	</view>
</template>

<script>
	export default {
		props: {
			src: String, // 视频地址
			poster: String, // 封面图
			autoplay: { // 是否自动播放
				type: Boolean,
				default(){
					return false
				}
			},
			fullplay: { // 是否全屏播放，默认不全屏
				type: Boolean,
				default(){
					return false
				}
			},
			loop: { // 是否循环播放
				type: Boolean,
				default(){
					return true // 循环播放可避免Android微信播放完毕显示广告
				}
			},
			width: { // 宽度 (需带单位,支持格式: '100%', '300px', '300rpx')
				type: String,
				default: "100%"
			},
			height: { // 高度 (需带单位,支持格式: '100%', '300px', '300rpx')
				type: String,
				default: "225px"
			},
			mescroll: { // mescroll对象,APP端下拉刷新时显示封面,隐藏视频.缓解APP端视频下拉悬浮错位问题
				type: Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				showVideo: this.autoplay // 是否播放视频
			}
		},
		computed: {
			// 是否下拉中 (下拉隐藏视频,显示封面, 仅APP端生效)
			mescrollDownLoad() {
				// #ifdef APP-PLUS
				return this.mescroll.downLoadType
				// #endif
				// #ifndef APP-PLUS
				return false
				// #endif
			}
		},
		watch: {
			autoplay(val) {
				if(val) this.play()
			}
		},
		methods: {
			// 播放
			play(){
				this.showVideo = true
				this.wxAutoPlay()
			},
			// 视频点击事件
			videoClick(){
				// 全屏播放时，点击视频退出
				if(this.fullplay) this.showVideo = false
			},
			// 解决微信端视频无法自动播放的问题
			wxAutoPlay(){
				// #ifdef H5
				// 微信端
				if(navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
					// iOS
					let head = document.getElementsByTagName("head")[0]
					let wxscript = document.createElement("script");
					wxscript.type = "text/javascript"
					wxscript.src = "https://res.wx.qq.com/open/js/jweixin-1.6.0.js"
					head.appendChild(wxscript)
					let vm = this
					let doPlay = function(){
						vm.$refs.videoRef && vm.$refs.videoRef.play()
					}
					wxscript.onload = function(){
						window.wx.config({
							debug: !1,
							appId: "",
							timestamp: 1,
							nonceStr: "",
							signature: "",
							jsApiList: []
						})
						window.wx.ready(doPlay)
					}
					// Android
					document.addEventListener("WeixinJSBridgeReady", doPlay, false);
					// 先尝试播放
					setTimeout(()=>{
						doPlay()
					},20)
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.me-video{
		position: relative;
		background-color: #000;
		overflow: hidden;
		// 播放按钮
		.btn-play{
			z-index: 9;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-color: rgba(0,0,0,.75);
			pointer-events: none;
			.triangle{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-25%, -50%);
				width: 0;
				height: 0;
				border-top: 16rpx solid transparent;
				border-left: 24rpx solid #fff;
				border-bottom: 16rpx solid transparent;
			}
		}
		// 封面图
		.poster{
			width: 100%;
			height: 100%;
			vertical-align: bottom;
		}
		// 视频 (默认非全屏播放)
		.video{
			z-index: 8;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			// 全屏播放
			&.full-play{
				z-index: 999;
				position: fixed;
			}
			// 下拉时隐藏视频
			&.mescroll-dowload{
				display: none;
			}
		}
	}
</style>
