<template>
	<view class="content">
		<image class="sign" :src="base64" mode="aspectFill"></image>
		<view class="text-area">
			<text class="title" @click="navgoto">{{title}}</text>
		</view>
		<text class="base64" v-text="base64">
		</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '去签名',
				base64:'/static/logo.png'
			}
		},
		onLoad() {
		},
		methods: {
			navgoto(){
				uni.navigateTo({
					url: '/pages/index/sign'
				})
				uni.$on('getSignImg', ({base64}) => {
					console.log(base64)
					this.base64 = base64
				});
			}
		}
	}
</script>

<style>
	.content {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sign {
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
		border: 2rpx solid #1c1fcc;
		padding: 20rpx 40rpx;
	}
	.base64{
		white-space:normal;
		word-break:break-all;
		word-wrap:break-word;
		padding: 30rpx;
		flex: 1;
		overflow: auto;
	}
</style>
