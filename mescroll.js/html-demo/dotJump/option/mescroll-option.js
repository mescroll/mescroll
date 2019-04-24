/*
 *下拉刷新和上拉加载js
 * 
1.引用mescroll.css和mescroll.js; 引用自定义的mescroll-option.css和mescroll-option.js,并检查相关图片路径是否引用正确;

2.拷贝以下布局结构
<div id="mescroll" class="mescroll"> // id可修改,但class不能改;另外mescroll的height: 100%,所以父布局要有高度,否则无法触发上拉加载.
	//滑动区域的内容,如:<ul>列表数据</ul> ...
</div>

3.创建MeScroll对象,内部已默认开启下拉刷新
var mescroll = initMeScroll("mescroll", {
//	down:{
//		auto: true, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
//		callback: function() {
//			mescroll.resetUpScroll();//下拉刷新的回调,默认重置上拉加载列表为第一页
//		}
//	},
	up: {
//		auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认true
		callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
	}
});

function getListData(page){
	$.ajax({
        type: 'GET',
        url: 'xxxxxx?num='+page.num+"&size="+page.size,
        dataType: 'json',
        success: function(data){
        	//联网成功的回调,隐藏下拉刷新和上拉加载的状态;(参数:当前页数据的总数)
			mescroll.endSuccess(data.length);//如果传了参数,mescroll会自动判断列表若无任何数据,则提示空;列表无下一页数据,则提示无更多数据;如果不传参数则仅隐藏加载中的状态
			//设置列表数据
			//setListData(data);
        },
        error: function(data){
        	//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
	        mescroll.endErr();
        }
    });
}

其他常用方法:
1.主动触发下拉刷新 mescroll.triggerDownScroll();
2.主动触发上拉加载 mescroll.triggerUpScroll();
3.重置列表 mescroll.resetUpScroll();
4.滚动列表到指定位置 mescroll.scrollTo(y); (y=0回到列表顶部;如需滚动到列表底部,可设置y很大的值,比如y=99999);
5.获取下拉刷新的配置 mescroll.optDown;
6.获取上拉加载的配置 mescroll.optUp;
7.锁定下拉刷新 mescroll.lockDownScroll(isLock); (isLock=ture,null锁定;isLock=false解锁)
8.锁定上拉加载 mescroll.lockUpScroll(isLock); (isLock=ture,null锁定;isLock=false解锁)
**/

function initMeScroll(mescrollId, options) {
	//下拉刷新的布局内容
	var htmlContent = '<p class="downwarp-circle"></p>';
	htmlContent += '<img class="downwarp-ball" src="option/mescroll-ball.svg"/>';
	//上拉加载中的布局
	var htmlLoading = '<div class="upwarp-loading"><p></p><p></p><p></p><p></p><i></i></div>';
	//无数据的布局
	var htmlNodata = '<p class="upwarp-nodata">没有更多数据了~</p>';
	
	//自定义的配置 (以下注释部分等同于mescroll本身的默认配置,这里贴出来是为了便于理解,实际项目可直接删除)
	var myOption={
		down:{
			htmlContent: htmlContent, //布局内容
			inited: function(mescroll, downwarp) {
				//初始化完毕的回调,可缓存dom
				mescroll.downCircleDom = downwarp.getElementsByClassName("downwarp-circle")[0];
				mescroll.downBallDom = downwarp.getElementsByClassName("downwarp-ball")[0];
			},
			inOffset: function(mescroll) {
				//进入指定距离范围内那一刻的回调
				mescroll.downCircleDom.style.display="inline-block";
				mescroll.downCircleDom.classList.remove("mescorll-scale-out");
				mescroll.downBallDom.style.display="none";
			},
			outOffset: function(mescroll) {
				//下拉超过指定距离那一刻的回调
				mescroll.downCircleDom.style.display="none";
				mescroll.downBallDom.style.display="inline-block";
			},
//			onMoving: function(mescroll, rate, downHight) {
//				//下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
//			},
			showLoading: function(mescroll) {
				//触发下拉刷新的回调
				mescroll.downCircleDom.style.display="none";
				mescroll.downBallDom.style.display="inline-block";
			},
			afterLoading: function(mescroll){
				// 结束下拉之前的回调. return延时执行结束下拉的时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去结束下拉的场景
				mescroll.downCircleDom.style.display="inline-block";
				mescroll.downCircleDom.classList.add("mescorll-scale-out");
				mescroll.downBallDom.style.display="none";
				return 300; //与mescorll-scale-out的css动画时间保持一致,确保动画执行完毕才结束下拉刷新
			}
		},
		up:{
			htmlLoading: htmlLoading, //上拉加载中的布局
			htmlNodata: htmlNodata, //无数据的布局
//			showLoading: function(mescroll, upwarp) {
//				//上拉加载中..
//				upwarp.innerHTML = mescroll.optUp.htmlLoading;
//			},
//			showNoMore: function(mescroll, upwarp) {
//				//无更多数据
//				upwarp.innerHTML = mescroll.optUp.htmlNodata;
//			},
			empty: {
				icon: "option/mescroll-empty.png", //空布局的图标
				tip: "亲,暂无相关商品~",
				btntext: "去逛逛 >", //按钮,默认""
				btnClick: function(){//点击按钮的回调,默认null
					alert("点击了按钮,具体逻辑自行实现");
				} 
			},
			toTop: {
				src: "option/mescroll-totop.png" //回到顶部按钮的图片路径
			}
		}
	}
	
	//加入自定义的默认配置
	options=MeScroll.extend(options,myOption);
	
	//创建MeScroll对象
	return new MeScroll(mescrollId,options);
}