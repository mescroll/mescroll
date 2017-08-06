# mescroll
## mescroll -- 精致的下拉刷新和上拉加载js框架 (JS framework for pull-refresh and pull-up-loading)
## http://www.mescroll.com
1. 原生js, 支持vue, 不依赖jquery,zepto

2. 一套代码多端运行. 完美运行于android,iOS,手机浏览器,兼容PC主流浏览器

3. 参数自由搭配, 随心定制, 轻松拓展

4. 超详细注释,读懂源码 so easy

5. 主流APP案例, 丰富经典

## 目录:  

* <a href="#功能亮点-">功能亮点 </a> <br/>
* <a href="#快速入门-">快速入门 </a> <br/>
* <a href="#api文档-">API文档 </a> <br/>
* <a href="#常用方法-">常用方法 </a> <br/>
* <a href="#其他方法-">其他方法 </a> <br/>
* <a href="https://github.com/mescroll/mescroll-versions" target="_blank">历史版本 </a> <br/>
* <a href="http://www.mescroll.com/qa.html">常见问题 </a> <br/>
* <a href="#基础案例-base-demos-">基础案例 base demos </a> <br/>
* <a href="#中级案例-intermediate-demos-">中级案例 intermediate demos </a> <br/>
* <a href="#高级案例-senior-demos-">高级案例 senior demos </a> <br/>
* <a href="#下载基础中级案例源码-">下载基础中级案例源码 </a> <br/>
* <a href="#获取高级案例源码-">获取高级案例源码 </a> <br/>
* <a href="http://www.mescroll.com/reward.html#tagRank">打赏排行榜 </a> <br/>

## 功能亮点 :

1. 自动判断和提示列表无任何数据或无更多数据

2. 支持监听列表滚动事件,无需手动判断处理列表的页码,时间等变量

3. 可指定列表滚动到任何位置,附带平滑效果一键滚动到顶部或底部

4. 可配置列表数据不满屏时,自动加载下一页  

5. 一个界面可支持多个下拉刷新,上拉加载

6. 可临时锁定下拉刷新和上拉加载  

## 快速入门 :

1. 引用 **mescroll.min.css** , **mescroll.min.js**

2. 拷贝以下布局结构:  
```
        <div id="mescroll" class="mescroll">
            //列表内容,如:<ul>列表数据</ul> ...
        </div>  
```  

3. 创建MeScroll对象:  
```
        var mescroll = new MeScroll("mescroll", {
    		down: {
			callback: downCallback //下拉刷新的回调
		},
		up: {
			callback: upCallback //上拉加载回调,简写callback:function(page){upCallback(page);}
		}
	});
```  

4. 处理回调:
```
        //下拉刷新的回调
        function downCallback(){
            $.ajax({
                url: 'xxxxxx',
                success: function(data){
                	//联网成功的回调,隐藏下拉刷新的状态;
        		mescroll.endSuccess();//无参
        		//设置数据
        		//setXxxx(data);//自行实现 TODO
               },
               error: function(data){
               		//联网失败的回调,隐藏下拉刷新的状态
        	        mescroll.endErr();
                }
            });
        }

        //上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
        function upCallback(page){
            $.ajax({
                url: 'xxxxxx?num='+ page.num +"&size="+ page.size,
                success: function(data){
			//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
			//参数data.length:当前页的数据总数
			//mescroll会根据data.length自动判断列表如果无任何数据,则提示空,显示empty配置的内容;
			//列表如果无下一页数据,则提示无更多数据;
			//如果不传data.length,则仅隐藏下拉刷新和上拉加载的状态.例如downCallback
                	mescroll.endSuccess(data.length);
		        //设置列表数据
		        //setListData(data);//自行实现 TODO
                },
                error: function(data){
                	//联网失败的回调,隐藏下拉刷新和上拉加载的状态
	                mescroll.endErr();
                }
         });
        }
```  

--- 以上为mescroll最基本的用法,强烈建议您下载并查看 <a href="#基础案例-base-demos-">mescroll基础案例</a> , 发现mescroll更强大的功能 ~<br/>
--- 基础案例一共5个, 每个案例3分钟, 一共花您15分钟; 这15分钟您将了解mescroll在不同情况下应如何快速配置 ~<br/>
--- 磨刀不误砍柴工,心急吃不了热豆腐. 请静下心来体验与理解mescroll, 一定会让您事半功倍 ~<br/>
--- 如使用中有疑问, 请先查看  <a href="http://www.mescroll.com/qa.html">常见问题专区</a> ~<br/>


## API文档 :   
#### <a href="http://www.mescroll.com/api.html#options" target="_blank">前往官网查看 >> </a>

```
//创建mescroll对象
var mescroll = new MeScroll("mescroll", { down: {下拉刷新的配置参数}, up: {上拉加载的配置参数} });
```  

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>down 下拉刷新的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用下拉刷新</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>true</td>
		<td>是否在初始化完毕之后自动执行下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>autoShowLoading</td>
		<td>false</td>
		<td>如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定下拉刷新</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>80</td>
		<td>在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>outOffsetRate</td>
		<td>0.2</td>
		<td>在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值越接近0,高度变化越小,表现为越往下越难拉</td>
	</tr>
	<tr align="center">
		<td>mustToTop</td>
		<td>iOS默认值为false<br/>其他默认为true</td>
		<td>是否必须滑动到顶部才能下拉;因为列表回弹效果(-webkit-overflow-scrolling:touch)是iOS专属样式,所以iOS默认false,其他默认为true</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-downwarp"</td>
		<td>下拉刷新的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>resetClass</td>
		<td>"mescroll-downwarp-reset"</td>
		<td>下拉刷新高度重置的动画,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>htmlContent</td>
		<td>'&lt;p class="downwarp-progress"&gt;&lt;/p&gt;&lt;p class="downwarp-tip"&gt;下拉刷新&lt;/p&gt;'</td>
		<td>下拉刷新的布局内容</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, downwarp) { ... }</td>
		<td>下拉刷新初始化完毕的回调(mescroll实例对象,下拉刷新容器dom对象)</td>
	</tr>
	<tr align="center">
		<td>inOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离进入offset范围内那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>outOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离大于offset那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>onMoving</td>
		<td>function(mescroll, rate, downHight) { ... }</td>
		<td>下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度</td>
	</tr>
	<tr align="center">
		<td>beforeLoading</td>
		<td>function(mescroll, downwarp) { return false; }</td>
		<td>准备触发下拉刷新的回调; 如果要完全自定义下拉刷新,那么return true,此时将不触发showLoading和callback回调; 参考案例【淘宝 v6.8.0】</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll) { ... }</td>
		<td>显示下拉刷新进度的回调</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(mescroll) { mescroll.resetUpScroll(); }</td>
		<td>下拉刷新的回调; 默认重置上拉加载列表为第一页</td>
	</tr>
</table>

<br/>

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>up 上拉加载的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用上拉加载</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>false</td>
		<td>是否在初始化完毕之后自动执行上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定上拉加载</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>100</td>
		<td>列表滚动到距离底部小于100px,即可触发上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>noMoreSize</td>
		<td>5</td>
		<td>如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看</td>
	</tr>
	<tr align="center">
		<td>resetShowDownScroll</td>
		<td>false</td>
		<td>重置上拉加载数据,是否显示下拉刷新的进度布局</td>
	</tr>
	<tr align="center">
		<td>toTop</td>
		<td align="left">{ <br/>
			src: null, <br/>
			offset: 1000, <br/>
			warpClass: "mescroll-totop", <br/>
			showClass: "mescroll-fade-in", <br/>
			hideClass: "mescroll-fade-out", <br/>
			duration: 300 <br/>
		}</td>
		<td align="left">回到顶部按钮的配置: <br/>
			src: 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示 <br/>
			offset: 列表滚动1000px显示回到顶部按钮 <br/>
			warpClass: 按钮样式,参见mescroll.css <br/>
			showClass: 显示样式,参见mescroll.css <br/>
			hideClass: 隐藏样式,参见mescroll.css <br/>
			duration: 回到顶部的动画时长 <br/>
		</td>
	</tr>
	<tr align="center">
		<td>loadFull</td>
		<td align="left">{ <br/>
			use: false, <br/>
			delay: 500 <br/>
		}</td>
		<td align="left">
			use: 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止; 默认false,因为可通过调高page.size避免这个情况 <br/>
			delay: 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
		</td>
	</tr>
	<tr align="center">
		<td>empty</td>
		<td align="left">{ <br/>
			warpId: null, <br/>
			icon: null, <br/>
			tip: "暂无相关数据~", <br/>
			btntext: "", <br/>
			btnClick: null <br/>
		}</td>
		<td align="left">列表第一页无任何数据时,显示的空提示布局; 需配置warpId或clearEmptyId才生效 <br/>
			warpId: 父布局的id; 如果此项有值,将不使用clearEmptyId的值; <br/>
			icon: 空布局的图标路径 <br/>
			tip: 提示文本 <br/>
			btntext: 按钮文本 <br/>
			btnClick: 点击按钮的回调 <br/>
		</td>
	</tr>
	<tr align="center">
		<td>clearId</td>
		<td>null</td>
		<td>加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值</td>
	</tr>
	<tr align="center">
		<td>clearEmptyId</td>
		<td>null</td>
		<td>相当于同时设置了clearId和empty.warpId; 简化写法</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,使动画更流畅,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-upwarp"</td>
		<td>上拉加载的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>htmlLoading</td>
		<td>'&lt;p class="upwarp-progress mescroll-rotate"&gt;&lt;/p&gt;&lt;p class="upwarp-tip"&gt;加载中..&lt;/p&gt;'</td>
		<td>上拉加载中的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>htmlNodata</td>
		<td>'&lt;p class="upwarp-nodata"&gt;-- END --&lt;/p&gt;'</td>
		<td>无数据的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, upwarp){}</td>
		<td>初始化完毕的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示上拉加载中的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showNoMore</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示无更多数据的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>onScroll</td>
		<td>null</td>
		<td>列表滑动监听, 默认null<br/>例 onScroll : function(mescroll, y){ ... };  y为列表当前滚动条的位置)</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(page,mescroll){}</td>
		<td>上拉加载的回调; 回调(page对象,mescroll实例), 其中page={num:页码, size:每页数据的数量, time:第一页数据的时间}</td>
	</tr>
	<tr align="center">
		<td>page</td>
		<td align="left">{ <br/>num:0, <br/> size:10, <br/> time:null <br/>}</td>
		<td align="left">num: 当前页码,默认0,回调之前会加1,即callback(page)会从1开始; <br/>size: 每页数据的数量; <br/>time: 加载第一页数据服务器返回的时间;防止用户翻页时,后台新增了数据从而导致下一页数据重复;</td>
	</tr>
	<tr>
		<td align="center">scrollbar</td>
		<td>{<br/>&nbsp; use : ... , <br/>&nbsp; barClass : "mescroll-bar" <br/>}</td>
		<td>use : 是否开启自定义滚动条; PC端默认true开启自定义滚动条; 移动端默认false不使用 <br/>barClass : 自定义滚动条的样式; 参见mescroll.css</td>
	</tr>
</table>  

## 常用方法 :   
#### <a href="http://www.mescroll.com/api.html#methods" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center">
		<td>方法名</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>mescroll.endSuccess( dataSize, systime );</td>
		<td>
		隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br/>
		dataSize : 当前页获取的数据总数<br/>
		如果传了dataSize, 那么mescroll会自动判断: <br/>
		列表若无任何数据,则提示空,显示empty配置的内容(需配置empty或clearEmptyId)<br/>
		列表若无下一页数据,则提示无更多数据,显示htmlNodata配置的内容;<br/>
		如果不传dataSize, 则仅隐藏下拉刷新和上拉加载的状态<br/>
		systime : 加载第一页数据的服务器时间 (可空);<br/>
		防止用户翻页时,后台新增了数据从而导致下一页数据重复;
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.endErr();</td>
		<td>隐藏下拉刷新和上拉加载的状态, 在联网获取数据失败后调用;<br/>mescroll内部会自动恢复原来的页码,时间等变量;</td>
	</tr>
	<tr align="center">
		<td>mescroll.resetUpScroll( isShowLoading );</td>
		<td>重置列表 (常用于列表筛选条件变化或切换菜单时重新刷新列表数据)<br />isShowLoading 是否显示下拉或者上拉的进度布局; <br />1. 不传参或传true,则显示进度布局,默认不传参; <br />2. 传false则不显示进度布局 (常用于静默更新列表数据);</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerDownScroll();</td>
		<td>主动触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerUpScroll();</td>
		<td>主动触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>mescroll.scrollTo( y );</td>
		<td>滚动列表到指定位置 ( y=0回到列表顶部; 如需滚动到列表底部,可设置y很大的值,比如y=99999 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.optDown;</td>
		<td>获取下拉刷新的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.optUp;</td>
		<td>获取上拉加载的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockDownScroll( isLock );</td>
		<td>锁定下拉刷新 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockUpScroll( isLock );</td>
		<td>锁定上拉加载 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
</table>

## 其他方法 :  
#### <a href="http://www.mescroll.com/api.html#others" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="2">如果您已通读并理解 mescroll源码, 以下方法可灵活运用于更复杂的场景<br/>知其然, 知其所以然, 源码注释超详细, 读懂源码so easy~</tr>
	<tr align="center">
		<td width="288px">mescroll.showDownScroll();</td>
		<td width="600px">显示下拉刷新的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.endDownScroll();</td>
		<td>隐藏下拉刷新的进度布局<br/>
		mescroll.endSuccess() 和 mescroll.endErr() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showUpScroll();</td>
		<td>显示上拉加载的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showNoMore();</td>
		<td>显示上拉无更多数据的布局<br/>
		mescroll.endUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideUpScroll();</td>
		<td>隐藏上拉加载的布局<br/>
		mescroll.endUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.clearDataList();</td>
		<td>清空上拉加载的数据列表<br/>
		mescroll.resetUpScroll() 和 mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.loadFull();</td>
		<td>检查如果加载的数据过少,无法触发上拉加载时,则自动加载下一页,直到满屏或无数据<br/>
		此方法最好在列表的图片数据加载完成之后调用,以便计算列表内容高度的准确性<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showEmpty();</td>
		<td>显示无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.removeEmpty();</td>
		<td>移除无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showTopBtn();</td>
		<td>显示回到顶部的按钮</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideTopBtn();</td>
		<td>隐藏回到顶部的按钮</td>
	</tr>
</table>

## 基础案例 base demos :  
#### <a href="http://www.mescroll.com/demo.html" target="_blank">前往官网查看 >> </a>  

#### 1. 【新闻列表】演示下拉刷新添加新数据到列表顶部
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-news" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-news.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/list-news.gif) 
<br/><br/>  

#### 2. 【商品列表】演示下拉刷新重置列表数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-products" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-products.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/list-products.gif) 
<br/><br/>  

#### 3. 【单mescroll】演示每次切换菜单都重置列表,不缓存数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-mescroll-one" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-mescroll-one.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/list-mescroll-one.gif) 
<br/><br/>  

#### 4. 【多mescroll】演示每个菜单列表仅初始化一次,切换菜单缓存数据
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-mescroll-more" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-mescroll-more.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/list-mescroll-more.gif) 
<br/><br/>  

#### 5. 【满屏加载与锁定滑动】演示自动满屏加载,可临时锁定上拉刷新和下拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=list-full-lock" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/list-full-lock.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/list-full-lock.gif) 
<br/><br/>  

#### 6. 【mescroll所有配置项】源码展示mescroll所有配置项, 快速理解与调试mescroll
#### ---------- <a href="http://www.mescroll.com/preview.html?name=mescroll-options" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/base/mescroll-options.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/base/mescroll-options.gif) 
<br/><br/>  

## 中级案例 intermediate demos :  
#### <a href="http://www.mescroll.com/demo.html#middle" target="_blank">前往官网查看 >> </a>  

#### 1. 【知乎 v3.53.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=zhihu" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/zhihu/zhihu.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/zhihu/zhihu.gif) 
<br/><br/>  

#### 2. 【新浪微博 v7.6.1】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=xinlang" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/xinlang/xinlang.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/xinlang/xinlang.gif) 
<br/><br/>  

#### 3. 【贝贝 v6.0.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=beibei" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/beibei/beibei.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/beibei/beibei.gif) 
<br/><br/>  

#### 4. 【雅布力 v2.4.0】APP的下拉刷新上拉加载
#### ---------- <a href="http://www.mescroll.com/preview.html?name=yabuli" target="_blank">在线体验 </a> ---------- [查看源码](https://github.com/mescroll/mescroll/blob/master/demo/yabuli/yabuli.html) ---------- 
![](https://github.com/mescroll/mescroll/raw/master/demo/yabuli/yabuli.gif) 
<br/><br/>  

## 高级案例 senior demos :  
#### <a href="http://www.mescroll.com/demo.html#hight" target="_blank">前往官网查看 >> </a>  

#### 1. 【淘宝 v6.8.0】APP的下拉刷新上拉加载
![](https://github.com/mescroll/mescroll/raw/master/demo/taobao/taobao.gif) 
<br/><br/>  

#### 2. 【京东 v6.1.0】APP的下拉刷新上拉加载
![](https://github.com/mescroll/mescroll/raw/master/demo/jingdong/jingdong.gif) 
<br/><br/>  

#### 3. 【美团 v8.2.3】APP的下拉刷新上拉加载
![](https://github.com/mescroll/mescroll/raw/master/demo/meituan/meituan.gif) 
<br/><br/>  

#### 4. 【美囤妈妈 v2.0.5】APP的下拉刷新上拉加载
![](https://github.com/mescroll/mescroll/raw/master/demo/meitunmama/meitunmama.gif) 
<br/><br/>  

## 下载基础中级案例源码 :  

<table border="1" cellspacing="0" width="100%">
	<tr align="center" height="80px">
		<td>mescroll.css , mescroll.min.css</td>
		<td>mescroll.js , mescroll.min.js</td>
		<td>mescroll所有基础案例源码</td>
		<td>mescroll所有中级案例源码</td>
	</tr>
	<tr align="center" height="80px">
		<td colspan="4"> <a href="https://codeload.github.com/mescroll/mescroll/zip/master" target="_blank">【立即下载】</a> </td>
	</tr>
</table>  


## 获取高级案例源码 :  

<table border="1" cellspacing="0" width="100%">
	<tr align="center">
		<td rowspan="4" width="400px">
		mescroll高级案例源码 -- 淘宝 v6.8.0<br/>
		mescroll高级案例源码 -- 京东 v6.1.0<br/>
		mescroll高级案例源码 -- 美团 v8.2.3<br/>
		mescroll高级案例源码 -- 美囤妈妈 v2.0.5
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法一 】<br/>
		我是大神 , 我为mescroll添砖加瓦<br/>
		在 GitHub 上 Star 和 Fork 了 mescroll<br/>
		并提出优化或改进建议 且Pull requests 获得了采纳 ~
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法二 】<br/>
		我爱分享 , 编写mescroll相关案例<br/>
		联系 QQ 2260429223 投稿<br/>
		评审优化后,在mescroll官网展示<br/>
		源码指向您的GitHub
		</td>
	</tr>
	<tr align="center">
		<td width="480px">
		【 获取方法三 】<br/>
		我不做伸手党, 打赏任意金额<br/>
		联系 QQ 2260429223 获取高级案例源码<br/>
		<a href="http://www.mescroll.com/reward.html#tagRank">打赏排行 榜上有名</a>
		</td>
	</tr>
</table>  

![](https://github.com/mescroll/mescroll/raw/master/demo/res/pay-wx.jpg)  

![](https://github.com/mescroll/mescroll/raw/master/demo/res/pay-zfb.jpg)  


<br/><br/><br/>