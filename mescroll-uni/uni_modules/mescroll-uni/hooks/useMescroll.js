// 小程序无法在hook中使用页面级别生命周期,需单独传入: https://ask.dcloud.net.cn/question/161173
// import { onPageScroll, onReachBottom, onPullDownRefresh} from '@dcloudio/uni-app';

/** 
 * 初始化mescroll, 相当于vue2的mescroll-mixins.js文件 (mescroll-body 和 mescroll-uni 通用) 
 * mescroll-body需传入onPageScroll, onReachBottom
 * mescroll-uni无需传onPageScroll, onReachBottom
 * 当down.native为true时,需传入onPullDownRefresh
 */ 
function useMescroll(onPageScroll, onReachBottom, onPullDownRefresh){
	// mescroll实例对象
	let mescroll = null;
	
	// mescroll组件初始化的回调,可获取到mescroll对象
	const mescrollInit = (e)=> {
		mescroll = e;
	}
	
	// 获取mescroll对象, mescrollInit执行之后会有值, 生命周期created中会有值
	const getMescroll = ()=>{
		return mescroll
	}
	
	// 下拉刷新的回调 (mixin默认resetUpScroll)
	const downCallback = ()=> {
		if(mescroll.optUp.use){
			mescroll.resetUpScroll()
		}else{
			setTimeout(()=>{
				mescroll.endSuccess();
			}, 500)
		}
	}
	
	// 上拉加载的回调
	const upCallback = ()=> {
		// mixin默认延时500自动结束加载
		setTimeout(()=>{
			mescroll.endErr();
		}, 500)
	}
	
	// 注册系统自带的下拉刷新 (配置down.native为true时生效, 还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
	onPullDownRefresh && onPullDownRefresh(() => {
	  mescroll && mescroll.onPullDownRefresh();
	})
	
	// 注册列表滚动事件,用于判定在顶部可下拉刷新,在指定位置可显示隐藏回到顶部按钮 (此方法为页面生命周期,无法在子组件中触发, 仅在mescroll-body生效)
	onPageScroll && onPageScroll(e=>{
		mescroll && mescroll.onPageScroll(e);
	})
	
	// 注册滚动到底部的事件,用于上拉加载 (此方法为页面生命周期,无法在子组件中触发, 仅在mescroll-body生效)
	onReachBottom && onReachBottom(()=>{
		mescroll && mescroll.onReachBottom();
	}) 
	
	return {
		getMescroll,
		mescrollInit,
		downCallback,
		upCallback
	}
}

export default useMescroll