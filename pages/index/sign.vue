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
				bgImg:'', 				//https://alifei04.cfp.cn/creative/vcg/veer/1600water/veer-303195393.jpg
				rotate:90,
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
