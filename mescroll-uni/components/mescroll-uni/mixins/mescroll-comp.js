/**
 * mescroll-body写在子组件时,需通过mescroll的mixins补充子组件缺少的生命周期
 */
const MescrollCompMixin = {
	// 因为子组件无onPageScroll和onReachBottom的页面生命周期，需在页面传递进到子组件 (一级)
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
	data() {
		return {
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
	methods:{
		handlePageScroll(e){
			let item = this.$refs["mescrollItem"];
			if(item && item.mescroll) item.mescroll.onPageScroll(e);
		},
		handleReachBottom(){
			let item = this.$refs["mescrollItem"];
			if(item && item.mescroll) item.mescroll.onReachBottom();
		},
		handlePullDownRefresh(){
			let item = this.$refs["mescrollItem"];
			if(item && item.mescroll) item.mescroll.onPullDownRefresh();
		}
	}
}

export default MescrollCompMixin;
