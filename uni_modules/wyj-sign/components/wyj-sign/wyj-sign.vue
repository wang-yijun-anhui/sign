<template>
	<view class="sign_page" v-cloak>
		<view class="sign_body">
			<view class="cover">
				<view class="cover_text" :style="'transform: rotate( '+ rotate + 'deg);text-shadow: 10rpx 10rpx 5rpx ' + font_color+ ';'">{{uname}}</view>
			</view>
			<canvas class="sign_canvas" 
				disable-scroll="true" 
				canvas-id="handWriting"
				:style="bgImg ? 'background: url(' + bgImg + ');background-size:100% 100%;' : ''"
				@touchstart.stop="handWritingStart" 
				@touchmove.stop="handWritingMove"
				@touchend.stop="handWritingEnd"
				></canvas>
		</view>
		<view class="sign_footer">
			<view class="btn" @click="retDraw">取消</view>
			<view class="btn" @click="exportImg">确认</view>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from './index.js'
	export default {
		name: 'sign',																				//签名
		props:{
			uname:{
				type: String,
				default:'汪义俊'
			},
			bgImg:{																						//https://alifei04.cfp.cn/creative/vcg/veer/1600water/veer-303195393.jpg
				type: String,
				default:''
			},
			font_color:{
				type:String,
				default:'pink'
			},
			rotate:{
				type:[String,Number],
				default:0
			}
		},
		data(){
			return{
				canvasW:375,																		//canvas宽度
				canvasH:440,																		//canvas高度
				ctx: null,																			//canvas
				lineWidth:2,																		//线宽 建议1~5
				x0: 0, 																					//初始横坐标或上一段touchmove事件中触摸点的横坐标
				y0: 0, 																					//初始纵坐标或上一段touchmove事件中触摸点的纵坐标
				canClick:true,																	//旗帜
				flag:false,																			//签名旗帜
				on:false,																				//进来的人口
			}
		},
		async created() {
			this.ctx = uni.createCanvasContext('handWriting',this)
			function getImagePath(img) { 																			//获取图片
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: img,
						success: (res) => {
							resolve(res.path)
						},
						fail: () => {
							resolve(null)
						}
					})
			 })
			}
			let bg = await getImagePath(this.bgImg)
			this.ctx.drawImage(bg, 0, 0, this.canvasW, this.canvasH);
			this.ctx.setLineCap('round')
			this.ctx.fillStyle = '#000000'
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this)
			query.select('.sign_body').boundingClientRect(data => {
			  this.canvasW = data.width
			  this.canvasH = data.height
			}).exec();
		},
		methods:{
			retDraw(){																				//取消按钮事件
				this.flag = false
				this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
				this.ctx.draw()
			},
			async exportImg(){																//确认按钮事件
				let seif = this
				if(!seif.flag){
					uni.showToast({
						title: '请签名后在点击确定',
						icon: 'none',
						duration: 2000
					});
					return 
				}
				if(!seif.canClick) return
				seif.canClick = false
				let tempFile = await seif.saveCanvas()
				let base64 = await pathToBase64(tempFile)
				uni.$emit('getSignImg',{base64});							//向上一页传递图片base64数据
				uni.navigateBack()
				// 上一页使用uni.$on获取签名图片
				// uni.$on('getSignImg', ({base64}) => {
				// 	console.log(base64)
				// });
			},
			handWritingEnd(event){													//签名抬起事件
				console.log(event,'handWritingEnd')
				this.x0 = 0
				this.y0 = 0
			},
			handWritingMove(e){															//签名滑动事件
				console.log(e,'handWritingMove')
				// #ifdef MP-WEIXIN
				let dx = e.touches[0].clientX - this.x0
				let	dy = e.touches[0].clientY - this.y0
				// #endif
				// #ifdef APP-PLUS
				let dx = e.touches[0].x - this.x0
				let	dy = e.touches[0].y - this.y0
				// #endif
				this.ctx.moveTo(this.x0, this.y0)
				this.ctx.lineTo(this.x0 + dx, this.y0 + dy)
				this.ctx.setLineWidth(this.lineWidth)
				this.ctx.stroke()
				this.ctx.draw(true)
				// #ifdef MP-WEIXIN
				this.x0 = e.touches[0].clientX
				this.y0 = e.touches[0].clientY
				// #endif
				// #ifdef APP-PLUS
				this.x0 = e.touches[0].x
				this.y0 = e.touches[0].y
				// #endif
			},
			handWritingStart(e){														//签名按下事件 app获取的e不一样区分小程序app
				console.log(e,'handWritingStart')
				this.flag = true
				// #ifdef MP-WEIXIN
				this.x0 = e.touches[0].clientX 
				this.y0 = e.touches[0].clientY
				// #endif
				// #ifdef APP-PLUS
				this.x0 = e.touches[0].x
				this.y0 = e.touches[0].y
				// #endif
			},
			async saveCanvas(){															//绘画的图片
				return await new Promise((resolve,reject)=>{
					uni.canvasToTempFilePath({
						canvasId: 'handWriting',
						success: (res) => {
							console.log(res.tempFilePath)
							if(!res.tempFilePath){
									uni.showModal({
										title:'提示',
										content:'保存签名失败',
										showCancel:false
									})
									return
								}
							resolve(res.tempFilePath)
						},
						fail: (r) => {
							console.log('图片生成失败：'+r)
							resolve(false)
						}
					},this) 
				})
			}
		}
	}
</script>

<style scoped lang="scss">
[v-cloak]{
	display: none;
}
.sign_page{
	height: 100vh;
	width: 100vw;
	background: #FFFFFF;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.sign_footer{
		flex-shrink: 0;
		padding: 40rpx 30rpx 50rpx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		.btn{
			width: 300rpx;
			height: 80rpx;
			background: #0eb543;
			border-radius: 30rpx;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
			&:nth-child(1){
				background-color: #c3c3c3;
				color: #000000;
			}
		}
	}
	.sign_body{
		width: 100%;
		flex-grow: 1;
		background: #FAFAFA;
		.sign_canvas{
			width: 100%;
			height: 100%;
		}
	}
	.cover{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 170rpx;
		right: 0;
		// background-color: pink;
		display: flex;
		align-items: center;
		justify-content: center;
		.cover_text{
			opacity: .5;
			font-size: 200rpx;
			color: #fff;
		}
	}
}
</style>