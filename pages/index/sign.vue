<template>
	<view class="content">
		<wyj-sign :bgImg="bgImg" :font_color="font_color" :rotate="rotate"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uname:'',
				font_color: 'pink',
				bgImg:'https://cdn.other.ggjtaq.com/jtap_static/pages/study/watermark_bj.png',
				rotate:0,
			}
		},
	}
</script>

<style>
	.content {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
