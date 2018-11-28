<template>
    <div>
        <!-- 菜单 -->
        <div class="top-warp">
            <div class="head">
                <router-link class="btn-left" to="/">main</router-link>
                mescroll-more
            </div>
            <div class="tip">每个菜单列表仅初始化一次,切换菜单缓存数据</div>
            <div class="nav">
                <div v-for="(tabObj,n) in mescrollArr"
                     :key="tabObj.desc"
                     :class="{'active':tabType===n}"
                     @click="changeTab(n)">{{tabObj.desc}}
                </div>
            </div>
        </div>

        <!--根据导航分类标签数量,复用mescroll-vue组件-->
        <mescroll-vue v-for="(tabObj,index) in mescrollArr"
                      v-show="tabType===index"
                      :key="'mescroll'+index"
                      :ref="'mescroll'+index"
                      :down="getMescrollDown(index)"
                      :up="getMescrollUp(index)"
                      @init="mescrollInit(index,arguments)">
            <ul v-bind:id="'dataList'+index">
                <li class="data-li" v-for="pd in tabObj.list" :key="pd.id">
                    <img class="pd-img" :src="pd.pdImg">
                    <div class="pd-name">{{pd.pdName}}</div>
                    <p class="pd-price">{{pd.pdPrice}} 元</p>
                    <p class="pd-sold">已售{{pd.pdSold}}件</p>
                </li>
            </ul>
        </mescroll-vue>
    </div>
</template>

<script>
    // 引入mescroll的vue组件
    import MescrollVue from "mescroll.js/mescroll.vue";
    // 模拟数据
    import mockData from "../../mock/pdlist";

    export default {
        name: "mescrollMore",
        components: {
            MescrollVue
        },
        data() {
            return {
                mescrollArr: [
                    {
                        mescroll: null,
                        list: [],
                        isListInit: false,
                        desc: "全部"
                    }, // 全部
                    {
                        mescroll: null,
                        list: [],
                        isListInit: false,
                        desc: "奶粉"
                    }, // 奶粉
                    {
                        mescroll: null,
                        list: [],
                        isListInit: false,
                        desc: "面膜"
                    }, // 面膜
                    {
                        mescroll: null,
                        list: [],
                        isListInit: false,
                        desc: "图书"
                    } // 图书
                ],
                tabType: 0, // 菜单类型
            };
        },
        methods: {
            // mescroll组件初化始的回调,可获取到mescroll对象
            mescrollInit(tabIndex, arg) {
                arg[0].tabType = tabIndex;
                this.mescrollArr[tabIndex].mescroll = arg[0];
            },
            // 多mescroll的配置,需通过方法获取,保证每个配置是单例
            getMescrollDown(tabType) {
                let isAuto = tabType === 0; // 第一个mescroll传入true,列表自动加载
                return {
                    auto: isAuto,
                    callback: this.downCallback
                };
            },
            getMescrollUp(tabType) {
                let emptyWarpId = "dataList" + tabType;
                return {
                    // page:{num:1, size:9},
                    auto: false,
                    callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
                    noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                    empty: {
                        warpId: emptyWarpId, // 列表父布局的id;
                        icon: "http://www.mescroll.com/img/mescroll-empty.png", // 图标,默认null
                        tip: "暂无相关数据~", // 提示
                        btntext: "去逛逛 >", // 按钮,默认""
                        btnClick: function () {
                            // 点击按钮的回调,默认null
                            alert("点击了按钮,具体逻辑自行实现");
                        }
                    },
                    toTop: {
                        // 配置回到顶部按钮
                        src: "http://www.mescroll.com/img/mescroll-totop.png" // 图片路径,默认null (建议写成网络图,不必考虑相对路径)
                    }
                };
            },
            /* 下拉刷新的回调 */
            downCallback(mescroll) {
                // 这里加载你想下拉刷新的数据, 比如刷新tab1的轮播数据
                if (mescroll.tabType === 0) {
                    // loadSwiper();
                } else if (mescroll.tabType === 1) {
                    // ....
                } else if (mescroll.tabType === 2) {
                    // ....
                } else if (mescroll.tabType === 3) {
                    // ....
                }
                mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
            },
            /* 上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
            upCallback(page, mescroll) {
                if (typeof mescroll.tabType === "number") {
                    // 全部
                    this.mescrollArr[this.tabType].isListInit = true; // 标记列表已初始化,保证列表只初始化一次
                    this.getListDataFromNet(
                        mescroll.tabType,
                        page.num,
                        page.size,
                        curPageData => {
                            mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                            if (page.num === 1) this.mescrollArr[this.tabType].list = []; // 如果是第一页需手动制空列表
                            this.mescrollArr[this.tabType].list = this.mescrollArr[
                                this.tabType
                                ].list.concat(curPageData); // 追加新数据
                        },
                        () => {
                            if (page.num === 1) this.mescrollArr[this.tabType].isListInit = false;
                            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
                        }
                    );
                }
            },

            // 切换菜单
            changeTab(type) {
                let curTab = this.getTabData(this.tabType); // 当前列表
                let newTab = this.getTabData(type); // 新转换的列表
                curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
                this.tabType = type; // 切换菜单
                if (!newTab.isListInit) {
                    newTab.mescroll.triggerDownScroll(); // 加载列表
                } else {
                    setTimeout(() => {
                        // 检查新转换的列表是否需要显示回到到顶按钮
                        var curScrollTop = newTab.mescroll.getScrollTop();
                        if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
                            newTab.mescroll.showTopBtn();
                        } else {
                            newTab.mescroll.hideTopBtn();
                        }
                    }, 30);
                }
            },
            // 获取菜单对应的数据
            getTabData(tabType) {
                if (tabType === null) tabType = this.tabType;
                if (typeof tabType === "number") {
                    return this.mescrollArr[tabType];
                }
            },
            /* 联网加载列表数据
                  在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
                  请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
                  实际项目以您服务器接口返回的数据为准,无需本地处理分页.
                  * */
            getListDataFromNet(
                tabType,
                pageNum,
                pageSize,
                successCallback,
                errorCallback
            ) {
                // 延时一秒,模拟联网
                setTimeout(() => {
                    try {
                        var listData = [];
                        // tabType 全部商品0; 奶粉1; 面膜2; 图书3;
                        if (tabType === 0) {
                            // 全部商品 (模拟分页数据)
                            for (
                                var i = (pageNum - 1) * pageSize;
                                i < pageNum * pageSize;
                                i++
                            ) {
                                if (i === mockData.length) break;
                                listData.push(mockData[i]);
                            }
                        } else if (tabType === 1) {
                            // 奶粉
                            for (var n = 0; n < mockData.length; n++) {
                                if (mockData[n].pdName.indexOf("奶粉") !== -1) {
                                    listData.push(mockData[n]);
                                }
                            }
                        } else if (tabType === 2) {
                            // 面膜
                            for (var j = 0; j < mockData.length; j++) {
                                if (mockData[j].pdName.indexOf("面膜") !== -1) {
                                    listData.push(mockData[j]);
                                }
                            }
                        } else if (tabType === 2) {
                            // 图书
                            for (var k = 0; k < mockData.length; k++) {
                                if (mockData[k].pdName.indexOf("图书") !== -1) {
                                    listData.push(mockData[k]);
                                }
                            }
                        }
                        // 回调
                        successCallback && successCallback(listData);
                    } catch (e) {
                        // 联网失败的回调
                        errorCallback && errorCallback();
                    }
                }, 1000);
            }
        },
        beforeRouteEnter(to, from, next) {
            // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
            next(vm => {
                let curMescroll = vm.$refs["mescroll" + vm.tabType][0]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
                curMescroll && curMescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
            });
        },
        beforeRouteLeave(to, from, next) {
            // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
            let curMescroll = this.$refs["mescroll" + this.tabType][0]; // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
            curMescroll && curMescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
            next();
        }
    };
</script>

<style scoped>
    /*以fixed的方式固定mescroll的高度*/
    .mescroll {
        position: fixed;
        top: 120px;
        bottom: 0;
        height: auto;
    }

    .top-warp {
        z-index: 9990;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 120px;
        background-color: white;
    }

    .top-warp .head {
        width: 100%;
        height: 44px;
        line-height: 44px;
        text-align: center;
    }

    .top-warp .head .btn-left {
        position: absolute;
        top: 0;
        left: 0;
        padding: 12px;
        line-height: 22px;
    }

    .top-warp .tip {
        font-size: 14px;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }

    .top-warp .nav {
        text-align: center;
        height: 40px;
        background: white;
    }

    .top-warp .nav > div {
        display: inline-block;
        width: 22%;
        line-height: 36px;
        font-size: 14px;
    }

    .top-warp .nav .active {
        border-bottom: 1px solid #ff6990;
        color: #ff6990;
    }

    /*展示上拉加载的数据列表*/
    .data-li {
        position: relative;
        height: 80px;
        padding: 10px 8px 10px 120px;
        border-bottom: 1px solid #eee;
    }

    .data-li .pd-img {
        position: absolute;
        left: 18px;
        top: 10px;
        width: 80px;
        height: 80px;
    }

    .data-li .pd-name {
        font-size: 13px;
        line-height: 20px;
        height: 40px;
        margin-bottom: 10px;
        overflow: hidden;
    }

    .data-li .pd-price {
        font-size: 13px;
        color: red;
    }

    .data-li .pd-sold {
        font-size: 12px;
        margin-top: 8px;
        color: gray;
    }
</style>
