/*! mescroll -- 精致的下拉刷新和上拉加载js框架
 * version 1.4.1
 * 2019-2-1 文举
 * http://www.mescroll.com
 */
(function (name, definition) {
  if (typeof define === 'function') {
    // AMD环境或CMD环境
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    // 定义为普通Node模块
    module.exports = definition();
  } else {
    // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
    this[name] = definition();
  }
})('MeScroll', function () {
  var MeScroll = function (mescrollId, options) {
    var me = this;
    me.version = '1.4.0'; // mescroll版本号
    me.isScrollBody = (!mescrollId || mescrollId === 'body'); // 滑动区域是否为body
    me.scrollDom = me.isScrollBody ? document.body : me.getDomById(mescrollId); // MeScroll的滑动区域
    if (!me.scrollDom) return;

    me.options = options || {}; // 配置

    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 是否为ios设备
    var isPC = typeof window.orientation === 'undefined'; // 是否为PC端
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;// 是否为android端

    me.os = {
      ios: isIOS,
      pc: isPC,
      android: isAndroid
    }

    me.isDownScrolling = false; // 是否在执行下拉刷新的回调
    me.isUpScrolling = false; // 是否在执行上拉加载的回调
    var hasDownCallback = me.options.down && me.options.down.callback; // 是否配置了down的callback

    // 初始化下拉刷新
    me.initDownScroll();
    // 初始化上拉加载,则初始化
    me.initUpScroll();

    // 自动加载
    setTimeout(function () { // 待主线程执行完毕再执行,避免new MeScroll未初始化,在回调获取不到mescroll的实例
      // 自动触发下拉刷新 (只有配置了down的callback才自动触发下拉刷新)
      if (me.optDown.use && me.optDown.auto && hasDownCallback) {
        if (me.optDown.autoShowLoading) {
          me.triggerDownScroll(); // 显示下拉进度,执行下拉回调
        } else {
          me.optDown.callback && me.optDown.callback(me); // 不显示下拉进度,直接执行下拉回调
        }
      }
      // 自动触发上拉加载
      me.optUp.use && me.optUp.auto && !me.isUpAutoLoad && me.triggerUpScroll();
    }, 30); // 需让me.optDown.inited和me.optUp.inited先执行
  }

  /* 配置参数:下拉刷新 */
  MeScroll.prototype.extendDownScroll = function (optDown) {
    // 下拉刷新的配置
    MeScroll.extend(optDown, {
      use: true, // 是否启用下拉刷新; 默认true
      auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
      autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
      isLock: false, // 是否锁定下拉刷新,默认false;
      isBoth: false, // 下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载;默认false,两者不可同时触发;
      offset: 80, // 在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调
      inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
      outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
      bottomOffset: 20, // 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
      minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
      hardwareClass: 'mescroll-hardware', // 硬件加速样式,解决部分手机闪屏或动画不流畅的问题
      mustToTop: false, // 是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.
      warpId: null, // 可配置下拉刷新的布局添加到指定id的div;默认不配置,默认添加到mescrollId
      warpClass: 'mescroll-downwarp', // 下拉刷新的布局容器样式,参见mescroll.css
      resetClass: 'mescroll-downwarp-reset', // 下拉刷新高度重置的动画,参见mescroll.css
      textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
      textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
      textLoading: '加载中 ...', // 加载中的提示文本
      htmlContent: '<p class="downwarp-progress"></p><p class="downwarp-tip"></p>', // 布局内容
      inited: function (mescroll, downwarp) {
        // 下拉刷新初始化完毕的回调
        mescroll.downTipDom = downwarp.getElementsByClassName('downwarp-tip')[0];
        mescroll.downProgressDom = downwarp.getElementsByClassName('downwarp-progress')[0];
      },
      inOffset: function (mescroll) {
        // 下拉的距离进入offset范围内那一刻的回调
        if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textInOffset;
        if (mescroll.downProgressDom) mescroll.downProgressDom.classList.remove('mescroll-rotate');
      },
      outOffset: function (mescroll) {
        // 下拉的距离大于offset那一刻的回调
        if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textOutOffset;
      },
      onMoving: function (mescroll, rate, downHight) {
        // 下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
        if (mescroll.downProgressDom) {
          var progress = 360 * rate;
          mescroll.downProgressDom.style.webkitTransform = 'rotate(' + progress + 'deg)';
          mescroll.downProgressDom.style.transform = 'rotate(' + progress + 'deg)';
        }
      },
      beforeLoading: function (mescroll, downwarp) {
        // 准备触发下拉刷新的回调
        return false; // 如果return true,将不触发showLoading和callback回调; 常用来完全自定义下拉刷新, 参考案例【淘宝 v6.8.0】
      },
      showLoading: function (mescroll) {
        // 显示下拉刷新进度的回调
        if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textLoading;
        if (mescroll.downProgressDom) mescroll.downProgressDom.classList.add('mescroll-rotate');
      },
      afterLoading: function (mescroll) {
        // 准备结束下拉的回调. 返回结束下拉的延时执行时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去隐藏下拉刷新的场景, 参考案例【dotJump】
        return 0
      },
      callback: function (mescroll) {
        // 下拉刷新的回调;默认重置上拉加载列表为第一页
        mescroll.resetUpScroll();
      }
    })
  }

  /* 配置参数:上拉加载 */
  MeScroll.prototype.extendUpScroll = function (optUp) {
    // 是否为PC端,如果是scrollbar端,默认自定义滚动条
    var isPC = this.os.pc;
    // 上拉加载的配置
    MeScroll.extend(optUp, {
      use: true, // 是否启用上拉加载; 默认true
      auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
      isLock: false, // 是否锁定上拉加载,默认false;
      isBoth: false, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发;
      isBounce: true, // 是否允许ios的bounce回弹;默认true,允许; 如果设置为false,则除了mescroll, mescroll-touch, mescroll-touch-x, mescroll-touch-y能够接收touchmove事件,其他部分均无法滑动,能够有效禁止bounce
      callback: null, // 上拉加载的回调;function(page,mescroll){ }
      page: {
        num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        size: 10, // 每页数据的数量
        time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
      },
      noMoreSize: 5, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
      offset: 100, // 列表滚动到距离底部小于100px,即可触发上拉加载的回调
      toTop: {
        // 回到顶部按钮,需配置src才显示
        warpId: null, // 父布局的id; 默认添加在body中
        src: null, // 图片路径,默认null;
        html: null, // html标签内容,默认null; 如果同时设置了src,则优先取src
        offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000
        warpClass: 'mescroll-totop', // 按钮样式,参见mescroll.css
        showClass: 'mescroll-fade-in', // 显示样式,参见mescroll.css
        hideClass: 'mescroll-fade-out', // 隐藏样式,参见mescroll.css
        fadeDuration: 0.5, // 回到顶部按钮的显示隐藏动画时长,默认0.5秒. (注意:showClass和hideClass设置的动画时长不会生效.)
        duration: 300, // 回到顶部的动画时长,默认300ms
        supportTap: false, // 如果您的运行环境支持tap,则可配置true;
        btnClick: null // 点击按钮的回调; 小提示:如果在回调里return true,将不执行回到顶部的操作.
      },
      loadFull: {
        use: false, // 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止;默认false,因为可通过调高page.size避免这个情况
        delay: 500 // 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
      },
      empty: {
        // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId或clearEmptyId才生效;
        warpId: null, // 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
        icon: null, // 图标路径
        tip: '暂无相关数据~', // 提示
        btntext: '', // 按钮
        btnClick: null, // 点击按钮的回调
        supportTap: false // 如果您的运行环境支持tap,则可配置true;
      },
      clearId: null, // 加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值;
      clearEmptyId: null, // 相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
      hardwareClass: 'mescroll-hardware', // 硬件加速样式,使上拉动画流畅
      warpId: null, // 可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId
      warpClass: 'mescroll-upwarp', // 上拉加载的布局容器样式
      htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>', // 上拉加载中的布局
      htmlNodata: '<p class="upwarp-nodata">-- END --</p>', // 无数据的布局
      inited: function (mescroll, upwarp) {
        // 初始化完毕的回调,可缓存dom 比如 mescroll.upProgressDom = upwarp.getElementsByClassName("upwarp-progress")[0];
      },
      showLoading: function (mescroll, upwarp) {
        // 上拉加载中.. mescroll.upProgressDom.style.display = "block" 不通过此方式显示,因为ios快速滑动到底部,进度条会无法及时渲染
        upwarp.innerHTML = mescroll.optUp.htmlLoading;
      },
      showNoMore: function (mescroll, upwarp) {
        // 无更多数据
        upwarp.innerHTML = mescroll.optUp.htmlNodata;
      },
      onScroll: null, // 列表滑动监听,默认null; 例如 onScroll: function(mescroll, y, isUp){ }; //y为列表当前滚动条的位置; isUp=true向上滑,isUp=false向下滑
      scrollbar: {
        use: isPC, // 默认只在PC端自定义滚动条样式
        barClass: 'mescroll-bar'
      },
      lazyLoad: {
        use: false, // 是否开启懒加载,默认false
        attr: 'imgurl', // 网络图片地址的属性名 (图片加载成功会自动移除改属性): <img imgurl='网络图  src='占位图''/>
        showClass: 'mescroll-lazy-in', // 显示样式,参见mescroll.css
        delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
        offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
      }
    })
  }

  /* 配置参数 */
  MeScroll.extend = function (userOption, defaultOption) {
    if (!userOption) return defaultOption;
    for (var key in defaultOption) {
      if (userOption[key] == null) {
        userOption[key] = defaultOption[key];
      } else if (typeof userOption[key] === 'object') {
        MeScroll.extend(userOption[key], defaultOption[key]); // 深度匹配
      }
    }
    return userOption;
  }

  /* -------初始化下拉刷新------- */
  MeScroll.prototype.initDownScroll = function () {
    var me = this;

    // 配置参数
    me.optDown = me.options.down || {};

    // 具体参数配置
    me.extendDownScroll(me.optDown);

    // 鼠标或手指的按下事件
    me.touchstartEvent = function (e) {
      if (me.isScrollTo) me.preventDefault(e); // 如果列表执行滑动事件,则阻止事件,优先执行scrollTo方法

      me.startPoint = me.getPoint(e); // 记录起点
      me.lastPoint = me.startPoint; // 重置上次move的点

      me.maxTouchmoveY = me.getBodyHeight() - me.optDown.bottomOffset; // 手指触摸的最大范围(写在touchstart避免body获取高度为0的情况)
      me.inTouchend = false; // 标记不是touchend
      var scrollTop = me.getScrollTop();// 滚动条的位置
      me.isKeepTop = scrollTop === 0; // 标记滚动条起点为0
      if (me.os.pc && scrollTop <= 0) {
        // 在顶部给PC端添加move事件
        me.scrollDom.addEventListener('mousemove', me.touchmoveEvent, {
          passive: false
        });
        document.ondragstart = function () { // 在顶部禁止PC端拖拽图片,避免与下拉刷新冲突
          return false;
        }
      }
    }

    me.scrollDom.addEventListener('mousedown', me.touchstartEvent); // PC端鼠标事件
    me.scrollDom.addEventListener('touchstart', me.touchstartEvent); // 移动端手指事件

    // 鼠标或手指的滑动事件
    me.touchmoveEvent = function (e) {
      if (!me.startPoint) return;

      var scrollTop = me.getScrollTop(); // 当前滚动条的距离
      if (scrollTop > 0) me.isKeepTop = false; // 在移动过程中,只要滚动条有一次大于0,则标记false
      var curPoint = me.getPoint(e); // 当前点

      var moveY = curPoint.y - me.startPoint.y; // 和起点比,移动的距离,大于0向下拉,小于0向上拉

      // 向下拉
      if (moveY > 0) {
        // 在顶部
        if (scrollTop <= 0) {
          me.preventDefault(e); // 阻止浏览器默认的滚动,避免触发bounce

          // 可下拉的条件
          if (me.optDown.use && !me.inTouchend && !me.isDownScrolling && !me.optDown.isLock && (!me.isUpScrolling || (me.isUpScrolling && me.optUp.isBoth))) {
            if (me.optDown.mustToTop && !me.isKeepTop) return; // 是否配置了必须在顶部才可以下拉

            // 下拉的角度是否在配置的范围内
            var x = Math.abs(me.lastPoint.x - curPoint.x);
            var y = Math.abs(me.lastPoint.y - curPoint.y);
            var z = Math.sqrt(x * x + y * y);
            if (z !== 0) {
              var angle = Math.asin(y / z) / Math.PI * 180; // 两点之间的角度,区间 [0,90]
              if (angle < me.optDown.minAngle) return; // 如果小于配置的角度,则不往下执行下拉刷新
            }
						
            // 如果手指的位置超过配置的距离,则提前结束下拉,避免Webview嵌套导致touchend无法触发
            if (me.maxTouchmoveY > 0 && curPoint.y >= me.maxTouchmoveY) {
              me.inTouchend = true; // 标记执行touchend
              me.touchendEvent(); // 提前触发touchend
              return;
            }

            var diff = curPoint.y - me.lastPoint.y; // 和上次比,移动的距离 (大于0向下,小于0向上)
            if (!me.downHight) me.downHight = 0; // 下拉区域的高度
            // 下拉距离  < 指定距离
            if (me.downHight < me.optDown.offset) {
              if (me.movetype !== 1) {
                me.movetype = 1; // 加入标记,保证只执行一次
                me.optDown.inOffset(me); // 进入指定距离范围内那一刻的回调,只执行一次
                me.downwarp.classList.remove(me.optDown.resetClass); // 移除高度重置的动画
                me.isMoveDown = true; // 标记下拉区域高度改变,在touchend重置回来
                if (me.os.ios && !me.isKeepTop) { // 下拉过程中,滚动条一直在顶部的,则不必取消回弹,否则会闪白屏
                  me.scrollDom.classList.add(me.optDown.hardwareClass); // 开启硬件加速,解决iOS下拉因隐藏进度条而闪屏的问题
                  me.scrollDom.style.webkitOverflowScrolling = 'auto'; // 取消列表回弹效果,避免与下面me.downwarp.style.height混合,而导致界面抖动闪屏
                  me.isSetScrollAuto = true; // 标记设置了webkitOverflowScrolling为auto
                }
              }
              me.downHight += diff * me.optDown.inOffsetRate; // 越往下,高度变化越小

              // 指定距离  <= 下拉距离
            } else {
              if (me.movetype !== 2) {
                me.movetype = 2; // 加入标记,保证只执行一次
                me.optDown.outOffset(me); // 下拉超过指定距离那一刻的回调,只执行一次
                me.downwarp.classList.remove(me.optDown.resetClass); // 移除高度重置的动画
                me.isMoveDown = true; // 标记下拉区域高度改变,在touchend重置回来
                if (me.os.ios && !me.isKeepTop) { // 下拉过程中,滚动条一直在顶部的,则不必取消回弹,否则会闪白屏
                  me.scrollDom.classList.add(me.optDown.hardwareClass); // 开启硬件加速,解决iOS下拉因隐藏进度条而闪屏的问题
                  me.scrollDom.style.webkitOverflowScrolling = 'auto'; // 取消列表回弹效果,避免与下面me.downwarp.style.height混合,而导致界面抖动闪屏
                  me.isSetScrollAuto = true; // 标记设置了webkitOverflowScrolling为auto
                }
              }
              if (diff > 0) { // 向下拉
                me.downHight += diff * me.optDown.outOffsetRate; // 越往下,高度变化越小
              } else { // 向上收
                me.downHight += diff; // 向上收回高度,则向上滑多少收多少高度
              }
            }

            me.downwarp.style.height = me.downHight + 'px'; // 实时更新下拉区域高度
            var rate = me.downHight / me.optDown.offset; // 下拉区域当前高度与指定距离的比值
            me.optDown.onMoving(me, rate, me.downHight); // 下拉过程中的回调,一直在执行
          }
        }

        // 向上拉
      } else if (moveY < 0) {
        var scrollHeight = me.getScrollHeight(); // 滚动内容的高度
        var clientHeight = me.getClientHeight(); // 滚动容器的高度
        var toBottom = scrollHeight - clientHeight - scrollTop; // 滚动条距离底部的距离

        // 如果在底部,则阻止浏览器默认事件
        if (!me.optUp.isBounce && toBottom <= 0) me.preventDefault(e);

        // 如果不满屏或者已经在底部,无法触发scroll事件,此时需主动触发上拉回调
        if (me.optUp.use && !me.optUp.isLock && me.optUp.hasNext && !me.isUpScrolling && (!me.isDownScrolling || (me.isDownScrolling && me.optDown.isBoth)) && (clientHeight + me.optUp.offset >= scrollHeight || toBottom <= 0)) {
          me.triggerUpScroll();
        }
      }

      me.lastPoint = curPoint; // 记录本次移动的点
    }

    // 移动端手指的滑动事件
    me.scrollDom.addEventListener('touchmove', me.touchmoveEvent, {
      passive: false
    });

    // 鼠标或手指的离开事件
    me.touchendEvent = function () {
      // 如果下拉区域高度已改变,则需重置回来
      if (me.optDown.use && me.isMoveDown) {
        if (me.downHight >= me.optDown.offset) {
          // 符合触发刷新的条件
          me.triggerDownScroll();
        } else {
          // 不符合的话 则重置
          me.downwarp.classList.add(me.optDown.resetClass); // 加入高度重置的动画,过渡平滑
          me.downHight = 0;
          me.downwarp.style.height = 0;
        }
        if (me.isSetScrollAuto) {
          me.scrollDom.style.webkitOverflowScrolling = 'touch';
          me.scrollDom.classList.remove(me.optDown.hardwareClass);
          me.isSetScrollAuto = false;
        }
        me.movetype = 0;
        me.isMoveDown = false;
      }

      if (me.os.pc) {
        me.scrollDom.removeEventListener('mousemove', me.touchmoveEvent); // 移除pc端的move事件
        document.ondragstart = function () { // 解除PC端禁止拖拽图片
          return true;
        }
      }
    }

    me.scrollDom.addEventListener('mouseup', me.touchendEvent); // PC端鼠标抬起事件
    me.scrollDom.addEventListener('mouseleave', me.touchendEvent); // PC端鼠标离开事件
    me.scrollDom.addEventListener('touchend', me.touchendEvent); // 移动端手指事件
    me.scrollDom.addEventListener('touchcancel', me.touchendEvent); // 移动端系统停止跟踪触摸

    // 在页面中加入下拉布局
    if (me.optDown.use) {
      me.downwarp = document.createElement('div');
      me.downwarp.className = me.optDown.warpClass;
      me.downwarp.innerHTML = '<div class="downwarp-content">' + me.optDown.htmlContent + '</div>';
      var downparent = me.optDown.warpId ? me.getDomById(me.optDown.warpId) : me.scrollDom;
      if (me.optDown.warpId && downparent) {
        downparent.appendChild(me.downwarp);
      } else {
        if (!downparent) downparent = me.scrollDom;
        downparent.insertBefore(me.downwarp, me.scrollDom.firstChild);
      }
      // 初始化完毕的回调
      setTimeout(function () { // 待主线程执行完毕再执行,避免new MeScroll未初始化,在回调获取不到mescroll的实例
        me.optDown.inited(me, me.downwarp);
      }, 0)
    }
  }

  /* 阻止浏览器默认滚动事件 */
  MeScroll.prototype.preventDefault = function (e) {
    // cancelable:是否可以被禁用; defaultPrevented:是否已经被禁用
    if (e && e.cancelable && !e.defaultPrevented) e.preventDefault()
  }

  /* 根据点击滑动事件获取第一个手指的坐标 */
  MeScroll.prototype.getPoint = function (e) {
    return {
      x: e.touches ? e.touches[0].pageX : e.clientX,
      y: e.touches ? e.touches[0].pageY : e.clientY
    }
  }

  /* 触发下拉刷新 */
  MeScroll.prototype.triggerDownScroll = function () {
    if (!this.optDown.beforeLoading(this, this.downwarp)) { // 准备触发下拉的回调,return true则处于完全自定义状态;默认return false;
      this.showDownScroll(); // 下拉刷新中...
      this.optDown.callback && this.optDown.callback(this); // 执行回调,联网加载数据
    }
  }

  /* 显示下拉进度布局 */
  MeScroll.prototype.showDownScroll = function () {
    this.isDownScrolling = true; // 标记下拉中
    this.optDown.showLoading(this); // 下拉刷新中...
    this.downHight = this.optDown.offset; // 更新下拉区域高度
    this.downwarp.classList.add(this.optDown.resetClass); // 加入高度重置的动画,过渡平滑
    this.downwarp.style.height = this.optDown.offset + 'px'; // 调整下拉区域高度
  }

  /* 结束下拉刷新 */
  MeScroll.prototype.endDownScroll = function () {
    var me = this;
    // 结束下拉刷新的方法
    var endScroll = function () {
      me.downHight = 0;
      me.downwarp.style.height = 0;
      me.isDownScrolling = false;
      if (me.downProgressDom) me.downProgressDom.classList.remove('mescroll-rotate');
    }
    // 结束下拉刷新时的回调
    var delay = me.optDown.afterLoading(me); // 结束下拉刷新的延时,单位ms
    if (typeof delay === 'number' && delay > 0) {
      setTimeout(endScroll, delay);
    } else {
      endScroll();
    }
  }

  /* 锁定下拉刷新:isLock=ture,null锁定;isLock=false解锁 */
  MeScroll.prototype.lockDownScroll = function (isLock) {
    if (isLock == null) isLock = true;
    this.optDown.isLock = isLock;
  }

  /* -------初始化上拉加载------- */
  MeScroll.prototype.initUpScroll = function () {
    var me = this;

    // 配置参数
    me.optUp = me.options.up || {
      use: false
    };

    // 具体参数配置
    me.extendUpScroll(me.optUp);

    // 自定义滚动条 (默认只在PC端设置)
    if (me.optUp.scrollbar.use) me.scrollDom.classList.add(me.optUp.scrollbar.barClass);

    // 不允许ios的bounce时,需禁止webview的touchmove事件
    if (!me.optUp.isBounce) me.setBounce(false);

    if (me.optUp.use === false) return; // 配置不使用上拉加载时,则不初始化上拉布局
    me.optUp.hasNext = true; // 如果使用上拉,则默认有下一页

    // 在页面中加入上拉布局
    me.upwarp = document.createElement('div');
    me.upwarp.className = me.optUp.warpClass;
    var upparent;
    if (me.optUp.warpId) upparent = me.getDomById(me.optUp.warpId);
    if (!upparent) upparent = me.scrollDom;
    upparent.appendChild(me.upwarp);

    // 滚动监听
    me.preScrollY = 0;
    me.lazyStartTime = new Date().getTime();// 懒加载的初始间隔时间
    me.lazyTag = 'mescroll-lazying';// 懒加载时,图片正在加载的标记
    me.scrollEvent = function () {
      // 列表内容顶部卷去的高度(含列表边框)
      var scrollTop = me.getScrollTop();

      // 向上滑还是向下滑动
      var isUp = scrollTop - me.preScrollY > 0;
      me.preScrollY = scrollTop;

      // 如果没有在加载中
      if (isUp && !me.isUpScrolling && me.optUp.hasNext && !me.optUp.isLock && (!me.isDownScrolling || (me.isDownScrolling && me.optDown.isBoth))) {
        // offsetheight 列表高度(内容+内边距+边框),滚动条在边框之内,所以使用clientHeight即可
        // clientHeight 列表高度(内容+内边距),不含列表边框
        // scrollHeight 列表内容撑开的高度
		var toBottom = me.getScrollHeight() - me.getClientHeight() - scrollTop; // 滚动条距离底部的距离
		if (toBottom <= me.optUp.offset) {
			// 如果滚动条距离底部指定范围内且向上滑,则执行上拉加载回调
			me.triggerUpScroll();
		}
      }

      // 顶部按钮的显示隐藏
      var optTop = me.optUp.toTop;
      if (optTop.src || optTop.html) {
        if (scrollTop >= optTop.offset) {
          me.showTopBtn();
        } else {
          me.hideTopBtn();
        }
      }

      // 懒加载
      if (me.optUp.lazyLoad.use) {
        // 节流:限制触发时间间隔
        var curTime = new Date().getTime();
        me.lazyTimer && clearTimeout(me.lazyTimer);
        if (curTime - me.lazyStartTime >= me.optUp.lazyLoad.delay) {
          me.lazyStartTime = curTime;
          me.lazyLoad(0);// 列表刚滚动的时候,懒加载一次
        } else {
          me.lazyTimer = me.lazyLoad();
        }
      }

      // 滑动监听
      me.optUp.onScroll && me.optUp.onScroll(me, scrollTop, isUp);
    }

    if (me.isScrollBody) {
      window.addEventListener('scroll', me.scrollEvent);
    } else {
      me.scrollDom.addEventListener('scroll', me.scrollEvent);
    }

    // 初始化完毕的回调
    setTimeout(function () { // 待主线程执行完毕再执行,避免new MeScroll未初始化,在回调获取不到mescroll的实例
      me.optUp.inited(me, me.upwarp);
    }, 0)
  }

  /* 是否允许ios的Bounce; true或null为允许; false禁止bounce */
  MeScroll.prototype.setBounce = function (isBounce) {
    if (this.isScrollBody || !this.os.ios) return; // 不支持body为滚动区域和非ios设备
    if (isBounce === false) {
      this.optUp.isBounce = false; // 禁止
      window.addEventListener('touchmove', this.bounceTouchmove, {
        passive: false
      });
    } else {
      this.optUp.isBounce = true; // 允许
      window.removeEventListener('touchmove', this.bounceTouchmove);
    }
  }

  /* 处理bounce的touchmove事件 */
  MeScroll.prototype.bounceTouchmove = function (e) {
    var me = this;
    var el = e.target;
    // 当前touch的元素及父元素是否要拦截touchmove事件
    var isPrevent = true;
    while (el !== document.body && el !== document) {
      var cls = el.classList;
      if (cls) {
        if (cls.contains('mescroll') || cls.contains('mescroll-touch')) {
          isPrevent = false; // 如果是指定条件的元素,则无需拦截touchmove事件
          break;
        } else if (cls.contains('mescroll-touch-x') || cls.contains('mescroll-touch-y')) {
          // 如果配置了水平或者垂直滑动
          var curX = e.touches ? e.touches[0].pageX : e.clientX; // 当前第一个手指距离列表顶部的距离x
          var curY = e.touches ? e.touches[0].pageY : e.clientY; // 当前第一个手指距离列表顶部的距离y

          if (!me.preWinX) me.preWinX = curX; // 设置上次移动的距离x
          if (!me.preWinY) me.preWinY = curY; // 设置上次移动的距离y

          // 计算两点之间的角度
          var x = Math.abs(me.preWinX - curX);
          var y = Math.abs(me.preWinY - curY);
          var z = Math.sqrt(x * x + y * y);

          me.preWinX = curX; // 记录本次curX的值
          me.preWinY = curY; // 记录本次curY的值

          if (z !== 0) {
            var angle = Math.asin(y / z) / Math.PI * 180; // 角度区间 [0,90]
            if ((angle <= 45 && cls.contains('mescroll-touch-x')) || (angle > 45 && cls.contains('mescroll-touch-y'))) {
              isPrevent = false; // 水平滑动或者垂直滑动,不拦截touchmove事件
              break;
            }
          }
        }
      }
      el = el.parentNode; // 继续检查其父元素
    }

    // 拦截touchmove事件:是否可以被禁用&&是否已经被禁用 (这里不使用me.preventDefault(e)的方法,因为某些情况下会报找不到方法的异常)
    if (isPrevent && e.cancelable && !e.defaultPrevented && typeof e.preventDefault === "function") e.preventDefault();
  }

  /* 触发上拉加载 */
  MeScroll.prototype.triggerUpScroll = function () {
    if (this.optUp.callback && !this.isUpScrolling) {
      this.showUpScroll(); // 上拉加载中...
      this.optUp.page.num++; // 预先加一页,如果失败则减回
      this.isUpAutoLoad = true; // 标记上拉已经自动执行过,避免初始化时多次触发上拉回调
      this.optUp.callback(this.optUp.page, this); // 执行回调,联网加载数据
    }
  }

  /* 显示上拉加载中 */
  MeScroll.prototype.showUpScroll = function () {
    this.isUpScrolling = true; // 标记上拉加载中
    this.upwarp.classList.add(this.optUp.hardwareClass); // 添加硬件加速样式,使动画更流畅
    this.upwarp.style.visibility = 'visible'; // 显示上拉加载区域
    this.upwarp.style.display = 'block'; // 显示上拉加载区域
    this.optUp.showLoading(this, this.upwarp); // 加载中...
  }

  /* 显示上拉无更多数据 */
  MeScroll.prototype.showNoMore = function () {
    this.upwarp.style.visibility = 'visible'; // 显示上拉加载区域
    this.upwarp.style.display = 'block'; // 显示上拉加载区域
    this.optUp.hasNext = false; // 无更多数据
    this.optUp.showNoMore(this, this.upwarp); // 无更多数据
  }

  /* 隐藏上拉区域. displayAble: 是否通过display:none隐藏, 默认false通过visibility:hidden的方式隐藏**/
  MeScroll.prototype.hideUpScroll = function (displayAble) {
    if (displayAble) {
      this.upwarp.style.display = 'none'; // 通过display:none隐藏: 优点隐藏后不占位,缺点列表快速滑动到底部不能及时显示加载中
    } else {
      this.upwarp.style.visibility = 'hidden'; // 通过visibility:hidden的方式隐藏,优点当列表快速滑动到底部能及时显示加载中,缺点隐藏后会占位
    }
    this.upwarp.classList.remove(this.optUp.hardwareClass); // 移除硬件加速样式
    var upProgressDom = this.upwarp.getElementsByClassName('upwarp-progress')[0];
    if (upProgressDom) upProgressDom.classList.remove('mescroll-rotate');
  }

  /* 结束上拉加载 */
  MeScroll.prototype.endUpScroll = function (isShowNoMore, displayAble) {
    if (isShowNoMore != null) { // isShowNoMore=null,不处理下拉状态,下拉刷新的时候调用
      if (isShowNoMore) {
        this.showNoMore(); // isShowNoMore=true,显示无更多数据
      } else {
        this.hideUpScroll(displayAble); // isShowNoMore=false,隐藏上拉加载
      }
    }
    this.isUpScrolling = false; // 标记结束上拉加载
  }

  /* 重置上拉加载列表为第一页
     *isShowLoading 是否显示进度布局;
     * 1.默认null,不传参,则显示上拉加载的进度布局
     * 2.传参true, 则显示下拉刷新的进度布局
     * 3.传参false,则不显示上拉和下拉的进度 (常用于静默更新列表数据)
     */
  MeScroll.prototype.resetUpScroll = function (isShowLoading) {
    if (this.optUp && this.optUp.use) {
      var page = this.optUp.page;
      this.prePageNum = page.num; // 缓存重置前的页码,加载失败可退回
      this.prePageTime = page.time; // 缓存重置前的时间,加载失败可退回
      page.num = 1; // 重置为第一页
      page.time = null; // 重置时间为空
      if (!this.isDownScrolling && isShowLoading !== false) { // 如果不是下拉刷新触发的resetUpScroll并且不配置列表静默更新,则显示进度;
        if (isShowLoading == null) {
          this.removeEmpty(); // 移除空布局
          this.clearDataList(); // 先清空列表数据,才能显示到上拉加载的布局
          this.showUpScroll(); // 不传参,默认显示上拉加载的进度布局
        } else {
          this.showDownScroll(); // 传true,显示下拉刷新的进度布局,不清空列表
        }
      }
      this.isUpAutoLoad = true; // 标记上拉已经自动执行过,避免初始化时多次触发上拉回调
      this.optUp.callback && this.optUp.callback(page, this); // 执行上拉回调
    }
  }

  /* 设置page.num的值 */
  MeScroll.prototype.setPageNum = function (num) {
    this.optUp.page.num = num - 1;
  }

  /* 设置page.size的值 */
  MeScroll.prototype.setPageSize = function (size) {
    this.optUp.page.size = size;
  }

  /* 清空上拉加载的数据列表 */
  MeScroll.prototype.clearDataList = function () {
    var listId = this.optUp.clearId || this.optUp.clearEmptyId; // 优先使用clearId
    if (listId) {
      var listDom = this.getDomById(listId);
      if (listDom) listDom.innerHTML = '';
    }
  }

  /* 联网回调成功,结束下拉刷新和上拉加载
     * dataSize: 当前页的数据量(必传)
     * totalPage: 总页数(必传)
     * systime: 服务器时间 (可空)
     */
  MeScroll.prototype.endByPage = function (dataSize, totalPage, systime) {
    var hasNext;
    if (this.optUp.use && totalPage != null) hasNext = this.optUp.page.num < totalPage; // 是否还有下一页
    this.endSuccess(dataSize, hasNext, systime);
  }

  /* 联网回调成功,结束下拉刷新和上拉加载
     * dataSize: 当前页的数据量(必传)
     * totalSize: 列表所有数据总数量(必传)
     * systime: 服务器时间 (可空)
     */
  MeScroll.prototype.endBySize = function (dataSize, totalSize, systime) {
    var hasNext;
    if (this.optUp.use && totalSize != null) {
      var loadSize = (this.optUp.page.num - 1) * this.optUp.page.size + dataSize; // 已加载的数据总数
      hasNext = loadSize < totalSize; // 是否还有下一页
    }
    this.endSuccess(dataSize, hasNext, systime);
  }

  /* 联网回调成功,结束下拉刷新和上拉加载
     * dataSize: 当前页的数据个数(不是所有页的数据总和),用于上拉加载判断是否还有下一页.如果不传,则会判断还有下一页
     * hasNext: 是否还有下一页,布尔类型;用来解决这个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据dataSize判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
     * systime: 服务器时间(可空);用来解决这个小问题:当准备翻下一页时,数据库新增了几条记录,此时翻下一页,前面的几条数据会和上一页的重复;这里传入了systime,那么upCallback的page.time就会有值,把page.time传给服务器,让后台过滤新加入的那几条记录
     */
  MeScroll.prototype.endSuccess = function (dataSize, hasNext, systime) {
    var me = this;
    // 结束下拉刷新
    if (me.isDownScrolling) me.endDownScroll();

    // 结束上拉加载
    if (me.optUp.use) {
      var isShowNoMore; // 是否已无更多数据
      if (dataSize != null) {
        var pageNum = me.optUp.page.num; // 当前页码
        var pageSize = me.optUp.page.size; // 每页长度
        // 如果是第一页
        if (pageNum === 1) {
          me.clearDataList(); // 自动清空第一页列表数据
          if (systime) me.optUp.page.time = systime; // 设置加载列表数据第一页的时间
        }
        if (dataSize < pageSize || hasNext === false) {
          // 返回的数据不满一页时,则说明已无更多数据
          me.optUp.hasNext = false;
          if (dataSize === 0 && pageNum === 1) {
            // 如果第一页无任何数据且配置了空布局
            isShowNoMore = false;
            me.showEmpty();
          } else {
            // 总列表数少于配置的数量,则不显示无更多数据
            var allDataSize = (pageNum - 1) * pageSize + dataSize;
            if (allDataSize < me.optUp.noMoreSize) {
              isShowNoMore = false;
            } else {
              isShowNoMore = true;
            }
            me.removeEmpty(); // 移除空布局
          }
        } else {
          // 还有下一页
          isShowNoMore = false;
          me.optUp.hasNext = true;
          me.removeEmpty(); // 移除空布局
        }
      }

      // 隐藏上拉
      var displayAble = !me.optUp.hasNext; // 没有下一页且少于noMoreSize,则以display:none的方式隐藏上拉布局
      me.endUpScroll(isShowNoMore, displayAble);

      // 检查是否满屏自动加载下一页
      me.loadFull();

      // 懒加载
      me.optUp.lazyLoad.use && me.lazyLoad(16);
    }
  }

  /* 回调失败,结束下拉刷新和上拉加载 */
  MeScroll.prototype.endErr = function () {
    // 结束下拉,回调失败重置回原来的页码和时间
    if (this.isDownScrolling) {
      var page = this.optUp.page;
      if (page && this.prePageNum) {
        page.num = this.prePageNum;
        page.time = this.prePageTime;
      }
      this.endDownScroll();
    }
    // 结束上拉,回调失败重置回原来的页码
    if (this.isUpScrolling) {
      this.optUp.page.num--;
      this.endUpScroll(false);
    }
  }

  /* 检查如果加载的数据过少,无法触发上拉加载时,则自动加载下一页,直到满屏或者没有更多数据
     此方法最好在列表的数据加载完成之后调用,以便计算列表内容高度的准确性 */
  MeScroll.prototype.loadFull = function () {
    var me = this;
    if (me.optUp.loadFull.use && !me.optUp.isLock && me.optUp.hasNext && me.optUp.callback && me.getScrollHeight() <= me.getClientHeight()) {
      setTimeout(function () {
        // 延时之后,还需再判断一下高度,因为可能有些图片在延时期间加载完毕撑开高度
        if (me.getScrollHeight() <= me.getClientHeight()) me.triggerUpScroll();
      }, me.optUp.loadFull.delay)
    }
  }

  /* 锁定上拉加载:isLock=ture,null锁定;isLock=false解锁 */
  MeScroll.prototype.lockUpScroll = function (isLock) {
    if (isLock == null) isLock = true;
    this.optUp.isLock = isLock;
  }

  /* --------无任何数据的空布局-------- */
  MeScroll.prototype.showEmpty = function () {
    var me = this;
    var optEmpty = me.optUp.empty; // 空布局的配置
    var warpId = optEmpty.warpId || me.optUp.clearEmptyId; // 优先使用warpId
    if (warpId == null) return;
    var emptyWarp = me.getDomById(warpId) // 要显示空布局的位置
    // 如果是手动显示自定义内容 && 该 dom 存在
    if (optEmpty.isCustom && emptyWarp) {
      me.emptyDom = emptyWarp;
      return (emptyWarp.style.display = 'block');
    }
    if (emptyWarp) {
      me.removeEmpty(); // 先移除,避免重复加入
      // 初始化无任何数据的空布局
      var str = '';
      if (optEmpty.icon) str += '<img class="empty-icon" src="' + optEmpty.icon + '"/>'; // 图标
      if (optEmpty.tip) str += '<p class="empty-tip">' + optEmpty.tip + '</p>'; // 提示
      if (optEmpty.btntext) str += '<p class="empty-btn">' + optEmpty.btntext + '</p>'; // 按钮
      me.emptyDom = document.createElement('div');
      me.emptyDom.className = 'mescroll-empty';
      me.emptyDom.innerHTML = str;
      emptyWarp.appendChild(me.emptyDom);
      if (optEmpty.btnClick) { // 点击按钮的回调
        var emptyBtn = me.emptyDom.getElementsByClassName('empty-btn')[0];
        if (optEmpty.supportTap) {
          emptyBtn.addEventListener('tap', function (e) {
            e.stopPropagation();
            me.preventDefault(e)
            optEmpty.btnClick();
          })
        } else {
          emptyBtn.onclick = function () {
            optEmpty.btnClick();
          }
        }
      }
    }
  }
  /* 移除空布局 */
  MeScroll.prototype.removeEmpty = function () {
    if (this.optUp.empty.isCustom && this.emptyDom) {
      // 如果是手动显示自定义内容的话，隐藏该 dom
      this.emptyDom.style.display = 'none'
    } else {
      this.removeChild(this.emptyDom);
    }
  }

  /* --------回到顶部的按钮-------- */
  MeScroll.prototype.showTopBtn = function (fadeDuration) {
    if (!this.topBtnShow) {
      this.topBtnShow = true; // 标记显示
      var me = this;
      var optTop = me.optUp.toTop; // 回到顶部的配置
      if (me.toTopBtn == null) {
        // 未加入按钮,则加入
        if (optTop.html) {
          me.toTopBtn = document.createElement('div');
          me.toTopBtn.innerHTML = optTop.html;
        } else {
          me.toTopBtn = document.createElement('img');
          me.toTopBtn.src = optTop.src;
        }
        me.toTopBtn.className = optTop.warpClass;
        if (optTop.supportTap) {
          me.toTopBtn.addEventListener('tap', function (e) {
            e.stopPropagation();
            me.preventDefault(e);
            var disToTop = optTop.btnClick && optTop.btnClick(); // 执行回调
            if (disToTop !== true) { // 如果回调里return true,将不执行回到顶部操作
              me.scrollTo(0, me.optUp.toTop.duration); // 置顶
            }
          })
        } else {
          me.toTopBtn.onclick = function () {
            var disToTop = optTop.btnClick && optTop.btnClick(); // 执行回调
            if (disToTop !== true) { // 如果回调里return true,将不执行回到顶部操作
              me.scrollTo(0, me.optUp.toTop.duration); // 置顶
            }
          }
        }
        var warpDom; // 是否配置父布局
        if (optTop.warpId) warpDom = me.getDomById(optTop.warpId);
        if (!warpDom) warpDom = document.body;
        warpDom.appendChild(me.toTopBtn);
      }
      // 显示--淡入动画
      me.toTopBtn.classList.remove(optTop.hideClass);
      me.toTopBtn.classList.add(optTop.showClass);
      me.setTopBtnFadeDuration(fadeDuration);
    }
  }
  /* 隐藏回到顶部的按钮 */
  MeScroll.prototype.hideTopBtn = function (fadeDuration) {
    if (this.topBtnShow && this.toTopBtn) {
      this.topBtnShow = false;
      this.toTopBtn.classList.remove(this.optUp.toTop.showClass);
      this.toTopBtn.classList.add(this.optUp.toTop.hideClass);
      this.setTopBtnFadeDuration(fadeDuration);
    }
  }
  /* 设置回到顶部按钮的显示隐藏动画时长,默认0.5秒 */
  MeScroll.prototype.setTopBtnFadeDuration = function (fadeDuration) {
    if (this.toTopBtn) {
      var duration = (fadeDuration != null ? fadeDuration : this.optUp.toTop.fadeDuration) + 's';
      this.toTopBtn.style.animationDuration = duration;
      this.toTopBtn.style.webkitAnimationDuration = duration;
    }
  }

  /* 滑动列表到指定位置--带缓冲效果 (y=0回到顶部;如果要滚动到底部可以传一个较大的值,比如99999);t时长,单位ms,默认300 */
  MeScroll.prototype.scrollTo = function (y, t) {
    var me = this;
    var star = me.getScrollTop();
    var end = y;
    if (end > 0) {
      var maxY = me.getScrollHeight() - me.getClientHeight(); // y的最大值
      if (end > maxY) end = maxY; // 不可超过最大值
    } else {
      end = 0; // 不可小于0
    }
    me.isScrollTo = true; // 标记在滑动中,阻止列表的触摸事件
    me.scrollDom.style.webkitOverflowScrolling = 'auto';
    me.getStep(star, end, function (step) {
      me.setScrollTop(step);
      if (step === end) {
        me.scrollDom.style.webkitOverflowScrolling = 'touch';
        me.isScrollTo = false;
      }
    }, t)
  }

  /* 计步器
     star: 开始值
     end: 结束值
     callback(step,timer): 回调step值,计步器timer,可自行通过window.clearInterval(timer)结束计步器;
     t: 计步时长,传0则直接回调end值;不传则默认300ms
     rate: 周期;不传则默认30ms计步一次
     * */
  MeScroll.prototype.getStep = function (star, end, callback, t, rate) {
    var diff = end - star; // 差值
    if (t === 0 || diff === 0) {
      callback && callback(end);
      return;
    }
    t = t || 300; // 时长 300ms
    rate = rate || 30; // 周期 30ms
    var count = t / rate; // 次数
    var step = diff / count; // 步长
    var i = 0; // 计数
    var timer = window.setInterval(function () {
      if (i < count - 1) {
        star += step;
        callback && callback(star, timer);
        i++;
      } else {
        callback && callback(end, timer); // 最后一次直接设置end,避免计算误差
        window.clearInterval(timer);
      }
    }, rate);
  }

  /* 加载可视区域的图片 */
  MeScroll.prototype.lazyLoad = function (delay) {
    var me = this;
    var t = delay != null ? delay : me.optUp.lazyLoad.delay; // delay需支持传0,不使用短路求值
    var timer = setTimeout(function () {
      var domArr = me.scrollDom.querySelectorAll('[' + me.optUp.lazyLoad.attr + ']');
      var len = domArr.length;
      for (var i = 0; i < len; i++) {
        var dom = domArr[i];
        if (dom.getAttribute(me.lazyTag) !== 'true' && me.isInSee(dom, me.optUp.lazyLoad.offset)) {
          var imgurl = dom.getAttribute(me.optUp.lazyLoad.attr);
          // 采用临时img标签加载网络图: 1.不影响占位图; 2.成功可设置渐变动画; 3.失败后可重新触发加载;
          var temp = new Image();
          temp.onload = function () {
            var imgurl = this.src;// 需通过this取值
            var dom = this.dom;
            var showClass = me.optUp.lazyLoad.showClass;// 渐变动画
            showClass && dom.classList.add(showClass);
            if (dom.tagName === 'IMG') {
              dom.src = imgurl;// 如果是img标签,则直接设置src
            } else {
              dom.style.backgroundImage = 'url(' + imgurl + ')';// 如果其他标签,则直接设置背景
            }
            dom.removeAttribute(me.optUp.lazyLoad.attr);
            dom.removeAttribute(me.lazyTag);
          }
          temp.onerror = function () {
            this.dom.removeAttribute(me.lazyTag);// 失败的时候取消加载中的标记
          }
          temp.onabort = function () {
            this.dom.removeAttribute(me.lazyTag);// 失败的时候取消加载中的标记
          }
          temp.src = imgurl;
          // 标记在加载中..
          dom.setAttribute(me.lazyTag, 'true');
          // 把dom挂载到temp,确保在for循环的temp.onload能够正确取到对应的dom
          temp.dom = dom;
        }
      }
    }, t)
    return timer;
  }

  /* 判断元素是否在列表垂直区域可视 (不考虑scrollLeft的情况,因为没法监听每个div的水平滚动事件,也不考虑translateY的情况,因为情况比较少,且会增加计算的复杂度) */
  MeScroll.prototype.isInSee = function (dom, offset) {
    offset = offset || 0; // 可视区域上下偏移的距离
    var topDom = this.getOffsetTop(dom);// 元素顶部到容器顶部的距离
    var topSee = this.getScrollTop() - offset;// 滚动条的位置(可视范围的顶部)
    var bottomDom = topDom + dom.offsetHeight;// 元素底部到容器顶部的距离
    var bottomSee = topSee + offset + this.getClientHeight() + offset;// 滚动条的位置+容器高度(可视范围的底部)
    // 图片顶部在可视范围内 || 图片底部在可视范围 ; 不考虑scrollLeft和translateY的情况
    return (topDom < bottomSee && topDom >= topSee) || (bottomDom <= bottomSee && bottomDom > topSee);
  }

  /* 获取元素到mescroll滚动列表顶部的距离 */
  MeScroll.prototype.getOffsetTop = function (dom) {
    var top = dom.offsetTop;
    var parent = dom.offsetParent;
    while (parent != null && parent !== this.scrollDom) {
      top += parent.offsetTop + parent.clientTop;
      parent = parent.offsetParent;
    }
    return top;
  }

  /* 滚动内容的高度 */
  MeScroll.prototype.getScrollHeight = function () {
    return this.scrollDom.scrollHeight;
  }

  /* 滚动容器的高度 */
  MeScroll.prototype.getClientHeight = function () {
    if (this.isScrollBody && document.compatMode === 'CSS1Compat') {
      return document.documentElement.clientHeight;
    } else {
      return this.scrollDom.clientHeight;
    }
  }

  /* body的高度 */
  MeScroll.prototype.getBodyHeight = function () {
    return document.body.clientHeight || document.documentElement.clientHeight;
  }

  /* 滚动条的位置 */
  MeScroll.prototype.getScrollTop = function () {
    if (this.isScrollBody) {
      return document.documentElement.scrollTop || document.body.scrollTop;
    } else {
      return this.scrollDom.scrollTop;
    }
  }

  /* 滚动条到底部的距离 */
  MeScroll.prototype.getToBottom = function () {
    return this.getScrollHeight() - this.getClientHeight() - this.getScrollTop();
  }

  /* 设置滚动条的位置 */
  MeScroll.prototype.setScrollTop = function (y) {
    if (typeof y === 'number') {
      if (this.isScrollBody) {
        document.documentElement.scrollTop = y;
        document.body.scrollTop = y;
      } else {
        this.scrollDom.scrollTop = y;
      }
    }
  }

  /* 查找dom元素 */
  MeScroll.prototype.getDomById = function (id) {
    var dom;
    if (id) {
      if (typeof id === 'string') {
        dom = document.getElementById(id); // 如果是String,则根据id查找
      } else if (id.nodeType) {
        dom = id; // 如果是dom对象,则直接赋值
      }
    }
    if (!dom) console.error('the element with id as "' + id + '" can not be found: document.getElementById("' + id + '")==null');
    return dom;
  }

  /* 删除dom元素 */
  MeScroll.prototype.removeChild = function (dom) {
    if (dom) {
      var parent = dom.parentNode;
      parent && parent.removeChild(dom);
      dom = null;
    }
  }

  /* 销毁mescroll */
  MeScroll.prototype.destroy = function () {
    var me = this;

    // 移除下拉布局,移除事件
    me.scrollDom.removeEventListener('touchstart', me.touchstartEvent); // 移动端手指事件
    me.scrollDom.removeEventListener('touchmove', me.touchmoveEvent); // 移动端手指事件
    me.scrollDom.removeEventListener('touchend', me.touchendEvent); // 移动端手指事件
    me.scrollDom.removeEventListener('touchcancel', me.touchendEvent); // 移动端手指事件
    me.scrollDom.removeEventListener('mousedown', me.touchstartEvent); // PC端鼠标事件
    me.scrollDom.removeEventListener('mousemove', me.touchmoveEvent); // PC端鼠标事件
    me.scrollDom.removeEventListener('mouseup', me.touchendEvent); // PC端鼠标抬起事件
    me.scrollDom.removeEventListener('mouseleave', me.touchendEvent); // PC端鼠标离开事件
    me.removeChild(me.downwarp); // 下拉布局

    // 移除上拉布局,回到顶部按钮,移除事件
    if (me.isScrollBody) {
      window.removeEventListener('scroll', me.scrollEvent); // window的滚动事件
    } else {
      me.scrollDom.removeEventListener('scroll', me.scrollEvent); // div的滚动事件
    }
    me.removeChild(me.upwarp); // 上拉布局
    me.removeChild(me.toTopBtn); // 回到顶部按钮

    // 允许回弹,解除禁止webview的touchmove事件
    me.setBounce(true);
  }

  return MeScroll;
});
