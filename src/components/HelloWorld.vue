<template>
  <div class="body-overlay">
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
      fishSource:
        "https://m3u8.cc.netease.com/pushstation/e2cde9a16b5147da1854266756597/playlist.m3u8?wsSecret=827dc1009c60d31c6883d1c89cbbc0be&wsTime=5ffaf7b4",
    };
  },
  methods: {
    checkVideo() {
      //var myPlayer = videojs("my-video");
      //var that = this;
      this.$axios
			.get("api/v1/activitylives/anchor/lives?anchor_ccid=361433")
			.then((response) => {
				var id = response.data[0].channel_id
				console.log(id)
			}
			)
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
	this.getVideo()
	this.checkVideo()
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
