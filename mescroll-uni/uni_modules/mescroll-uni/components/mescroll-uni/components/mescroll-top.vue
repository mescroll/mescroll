<!-- 回到顶部的按钮 -->
<template>
	<image
		v-if="option.src"
		class="mescroll-totop"
		:class="[isShow ? 'mescroll-totop-in' : 'mescroll-totop-out', {'mescroll-totop-safearea': option.safearea}]"
		:style="{'z-index':option.zIndex, 'left': left, 'right': right, 'bottom':addUnit(option.bottom), 'width':addUnit(option.width), 'border-radius':addUnit(option.radius)}"
		:src="option.src"
		mode="widthFix"
		@click="toTopClick"
	/>
</template>

<script>
export default {
	props: {
		// up.toTop的配置项
		option: {
			type: Object,
			default(){
				return {}
			}
		},
		// 是否显示
		value: false, // vue2
		modelValue: false // vue3
	},
	computed: {
		// 优先显示左边
		left(){
			return this.option.left ? this.addUnit(this.option.left) : 'auto';
		},
		// 右边距离 (优先显示左边)
		right() {
			return this.option.left ? 'auto' : this.addUnit(this.option.right);
		},
		// 是否显示
		isShow(){
			// #ifdef VUE3
			return this.modelValue
			// #endif
			// #ifdef VUE2
			return this.value
			// #endif
		}
	},
	methods: {
		addUnit(num){
			if(!num) return 0;
			if(typeof num === 'number') return num + 'rpx';
			return num
		},
		toTopClick() {
			// #ifdef VUE3
			this.$emit("update:modelValue", false); // 使v-model生效 vue3
			// #endif
			// #ifdef VUE2
			this.$emit('input', false); // 使v-model生效 vue2
			// #endif
			this.$emit('click'); // 派发点击事件
		}
	}
};
</script>

<style>
/* 回到顶部的按钮 */
.mescroll-totop {
	z-index: 9990;
	position: fixed !important; /* 加上important避免编译到H5,在多mescroll中定位失效 */
	right: 20rpx;
	bottom: 120rpx;
	width: 72rpx;
	height: auto;
	border-radius: 50%;
	opacity: 0;
	transition: opacity 0.5s; /* 过渡 */
	margin-bottom: var(--window-bottom); /* css变量 */
}

/* 适配 iPhoneX */
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
	.mescroll-totop-safearea {
		margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom)); /* window-bottom + 适配 iPhoneX */
		margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
	}
}

/* 显示 -- 淡入 */
.mescroll-totop-in {
	opacity: 1;
}

/* 隐藏 -- 淡出且不接收事件*/
.mescroll-totop-out {
	opacity: 0;
	pointer-events: none;
}
</style>
