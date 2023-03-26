<template>
	<view>
		<!-- 菜单 -->
		<view class="top-warp">
			<view class="tip" @click="i18nChange()">点击切换语言</view>
			<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
		</view>
		
		<!-- 列表 -->
		 <mescroll-body :i18n="i18n" @init="mescrollInit" top="120" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
			<good-list :list="goods"></good-list>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {apiGoods} from "@/api/mock.js"
	
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				upOption:{
					noMoreSize: 4
				},
				goods: [],
				tabs: [{name:'全部',type:'xx'}, {name:'奶粉',type:'xx'}, {name:'面膜',type:'xx'}, {name:'图书',type:'xx'}],
				tabIndex: 0,
				i18n:{ // 具体页面的语言配置
					zh: {
						up:{
							empty:{ // 空布局的提示
								tip: '~ 搜索无数据 ~',
								btnText: '去商城逛逛'
							}
						}
					},
					en: {
						up:{
							empty: {
								tip: '~ Search for no data ~',
								btnText: 'go shopping >'
							}
						}
					}
				}
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let curTab = this.tabs[this.tabIndex]
				let keyword = curTab.name // 具体项目中,您可能取的是tab中的type,status等字段
				apiGoods(page.num, page.size, keyword).then(res=>{
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(res.list.length);
					//设置列表数据
					if(page.num == 1) this.goods = []; //如果是第一页需手动制空列表
					this.goods=this.goods.concat(res.list); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			},
			
			// 切换菜单
			tabChange() {
				this.goods = []// 先置空列表,显示加载进度
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			
			// 动态设置全局配置 (i18n 国际化)
			i18nChange(){
				// 语言切换
				let i18nType = this.mescroll.i18n.type == 'zh' ? 'en' : 'zh';
				// 动态更新全局配置
				uni.$emit("setMescrollGlobalOption", {i18n: {type: i18nType}})
				// 提示
				let tip = i18nType == 'zh' ? "已切换为中文语言" : "switched to English"
				uni.showToast({icon: "none", title: tip})
			}
		}
	}
</script>

<style>
	.top-warp{
		z-index: 9990;
		position: fixed;
		top: --window-top; /* css变量 */
		left: 0;
		width: 100%;
		height: 120upx;
		background-color: white;
	}
	.top-warp .tip{
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		color: red;
	}
</style>