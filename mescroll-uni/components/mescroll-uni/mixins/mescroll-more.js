/**
 * mescroll-body写在子组件时, 需通过mescroll的mixins补充子组件缺少的生命周期
 */
const MescrollMoreMixin = {
	data() {
		return {
			tabIndex: 0, // 当前tab下标
			mescroll: { // mescroll-body写在子子子...组件的情况 (多级)
				onPageScroll: e=>{
					this.handlePageScroll(e)
				},
				onReachBottom: ()=>{
					this.handleReachBottom()
				},
				onPullDownRefresh: ()=>{
					this.handlePullDownRefresh()
				}
			}
		}
	},
	// 因为子组件无onPageScroll和onReachBottom的页面生命周期，需在页面传递进到子组件
	onPageScroll(e) {
		this.handlePageScroll(e)
	},
	onReachBottom() {
		this.handleReachBottom()
	},
	// 当down的native: true时, 还需传递此方法进到子组件
	onPullDownRefresh(){
		this.handlePullDownRefresh()
	},
	methods:{
		handlePageScroll(e){
			let mescroll = this.getMescroll(this.tabIndex);
			mescroll && mescroll.onPageScroll(e);
		},
		handleReachBottom(){
			let mescroll = this.getMescroll(this.tabIndex);
			mescroll && mescroll.onReachBottom();
		},
		handlePullDownRefresh(){
			let mescroll = this.getMescroll(this.tabIndex);
			mescroll && mescroll.onPullDownRefresh();
		},
		// 根据下标获取对应子组件的mescroll
		getMescroll(i){
			if(!this.mescrollItems) this.mescrollItems = [];
			if(!this.mescrollItems[i]) {
				// v-for中的refs
				let vForItem = this.$refs["mescrollItem"];
				if(vForItem){
					this.mescrollItems[i] = vForItem[i]
				}else{
					// 普通的refs,不可重复
					this.mescrollItems[i] = this.$refs["mescrollItem"+i];
				}
			}
			let item = this.mescrollItems[i]
			return item ? item.mescroll : null
		},
		// 切换tab,恢复滚动条位置
		tabChange(i){
			let mescroll = this.getMescroll(i);
			if(mescroll){
				// 延时(比$nextTick靠谱一些),确保元素已渲染
				setTimeout(()=>{
					mescroll.scrollTo(mescroll.getScrollTop(),0)
				},30)
			}
		}
	}
}

export default MescrollMoreMixin;
