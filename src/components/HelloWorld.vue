<template>
	<div class="body-overlay">
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<a class="navbar-brand">摸鱼CC-Remastered Editon</a>
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<ul class="navbar-nav mr-auto">
					<li class="nav-item active">
						<a class="nav-link" href="#" @click="checkVideo">重置 </a>
					</li>
					<li class="nav-item">
						<b-button v-b-toggle.sidebar-1>弹幕</b-button>
					</li>
				</ul>
				<form class="form-inline mt-2 mt-md-0">
					<input
						class="form-control mr-sm-2"
						type="barrage"
						placeholder="请输入房间编号"
						aria-label="Search"
						v-model="fishId"
					/>
					<button
						class="btn btn-outline-success my-2 my-sm-0"
						type="submit"
						@click="checkVideo"
					>
						进入
					</button>
				</form>
			</b-collapse>
		</nav>
	<b-sidebar id="sidebar-1" no-header z-index=1000 bg-variant="halfgrey" text-variant="light" right>
		<b-form-textarea
			id="textarea"
			v-model="barrage"
			placeholder="Enter something..."
			rows="3"
			max-rows="999"
		></b-form-textarea>
	</b-sidebar>
		<video
			id="my-video"
			class="video-js vjs-default-skin video-content vjs-big-play-centered"
			controls
			preload="auto"
			width="100%"
		>
			<source :src="fishSource" type="application/x-mpegURL" />
		</video>
	</div>
</template>

<script>
import videojs from "video.js";
import "videojs-contrib-hls";

export default {
	name: "HelloWorld",
	data() {
		return {
			barrage : "",
			lockReconnect: false, //是否真正建立连接
			timeout: 20 * 1000, //20秒一次心跳
			timeoutObj: null, //心跳心跳倒计时
			serverTimeoutObj: null, //心跳倒计时
			timeoutnum: null, //断开 重连倒计时
			fishId: "361433",
			regData:{

			},
			beatData:{

			},
			joinData:{
				cid:0,
				gameType:0,
				roomId:0
			},
			fishSource:
				"https://m3u8.cc.netease.com/pushstation/e2cde9a16b5147da1854266756597/playlist.m3u8?wsSecret=827dc1009c60d31c6883d1c89cbbc0be&wsTime=5ffaf7b4",
			socket:"",
			socketPath:"wss://weblink.cc.163.com/"
		};
	},
	methods: {
		formatMsg(raw)
		{

		},
		sendRegData()
		{
			sid = 6144
			cid = 2
			update_req_info = {
				'22': 640,
				'23': 360,
				'24': "web",
				'25': "Linux",
				'29': "163_cc",
				'30': "",
				'31': "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Mobile Safari/537.36"
			}
			device_token = this.getUUid() + '@web.cc.163.com'
			macAdd = device_token
			data = {
				'web-cc': Date.now(),
				'macAdd': macAdd,
				'device_token': device_token,
				'page_uuid': this.getUUid(),
				'update_req_info': update_req_info,
				'system': 'win',
				'memory': 1,
				'version': 1,
				'webccType': 4253
			}

			this.sendMsg({sid:sid,cid:cid,data:data})
		},
		sendBeatData(){
			sid = 6144
			cid = 2
			data = {}
			this.sendMsg({sid:sid,cid:cid,data:data})
		},
		sendJoinData(){
			sid = 512
			cid = 1
			data = {
				'cid': this.joinData.cid,
				'gametype': this.joinData.gameType,
				'roomId': this.joinData.roomId
			}
			this.sendMsg({sid:sid,cid:cid,data:data})
		},
		sendMsg(e){
			try {
				this.socket.send(JSON.stringify(e))
			} catch(e) {}
		},
		getUUid(){
			function e() {
				return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
			}
			return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
		},
		getMessage(event){
			console.log(event)

		},
		sendHeartBeat(){

		},
		initws(){
			if(typeof(WebSocket) === "undefined"){
				alert("您的浏览器不支持socket")
			}else{
				this.socket = new WebSocket(this.socketPath)
				this.socket.onmessage = this.getMessage(event)
			}
		},
		start() {
			this.sendRegData()
			this.sendJoinData()
			//开启心跳
			var self = this;
			self.timeoutObj && clearTimeout(self.timeoutObj);
			self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
			self.timeoutObj = setTimeout(function() {
				//这里发送一个心跳，后端收到后，返回一个心跳消息
				if (self.socket.readyState == 1) {
				//如果连接正常
					self.sendBeatData()
				} else {
				//否则重连
					self.reconnect();
				}
				self.serverTimeoutObj = setTimeout(function() {
				//超时关闭
				self.socket.close();
				}, self.timeout);
			}, self.timeout);
			},
		websocketonopen() {
			//连接成功事件
			this.websocketsend('发送数据');
			//提示成功
			console.log("连接成功", 3);
			//开启心跳
			this.start();
    	},
		reconnect() {
			//重新连接
			var that = this;
			if (that.lockReconnect) {
				return;
			}
			that.lockReconnect = true;
			//没连接上会一直重连，设置延迟避免请求过多
			that.timeoutnum && clearTimeout(that.timeoutnum);
			that.timeoutnum = setTimeout(function() {
				//新连接
				that.initWebSocket();
				that.lockReconnect = false;
			}, 5000);
		},
		reset() {
			//重置心跳
			var that = this;
			//清除时间
			clearTimeout(that.timeoutObj);
			clearTimeout(that.serverTimeoutObj);
			//重启心跳
			that.start();
		},
		checkVideo() {
			var myPlayer = videojs("my-video");
			var that = this;
			this.$axios
				.get("api/lives?anchor_ccid=" + this.fishId)
				.then((response) => {
					var id = response.data.data[that.fishId].channel_id;
					this.joinData.cid = response.data.data[that.fishId].channel_id
					this.joinData.roomId = response.data.data[that.fishId].roomId
					this.joinData.gameType = response.data.data[that.fishId].gameType
					console.log(id);
					this.$axios
						.get("channel/?channelids=" + id)
						.then((response) => {
							var address = response.data.data[0].sharefile;
							console.log(address);
							myPlayer.src([
								{
									type: "application/x-mpegURL",
									src: address,
								},
							]);
							that.fishSource = address;
							that.getVideo();
							that.initws()
						})
						.catch(function (error) {
							// 请求失败处理
							console.log(error);
						});
				})
				.catch(function (error) {
					// 请求失败处理
					console.log(error);
				});
		},

		getVideo() {
			videojs(
				"my-video",
				{
					bigPlayButton: false,
					textTrackDisplay: false,
					posterImage: true,
					errorDisplay: false,
					controlBar: true,
				},
				function () {
					this.play();
				}
			);
		},
	},
	mounted() {
		this.checkVideo();
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
