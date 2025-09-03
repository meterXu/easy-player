<script setup lang="ts">
import {ref, onMounted} from 'vue'
import VueEasyPlayerPro from "@/packages/vue-easy-player-pro";
const playerRef = ref()
const isMute = ref(true)
const isPause = ref(true)
const isFullscreen = ref(false)
const url = ref('https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8')
const videoInfo = ref()
const audioInfo = ref()

let easyPlayer = null as any
onMounted(() => {

})
</script>

<template>
  <main class="content-wrap">
<!--    <div class="play-control">-->
<!--      <input v-model="url" style="width: 100%"/>-->
<!--      <div class="play-btns">-->
<!--        <button @click="onPlay">播放</button>-->
<!--        <button @click="onPause">暂停,{{isPause}}</button>-->
<!--        <button @click="onMute">切换静音,{{isMute}}</button>-->
<!--        <button @click="onScreenshot">获取快照</button>-->
<!--        <button @click="onSetFullscreen">切换全屏,{{isFullscreen}}</button>-->
<!--        <button @click="onexitFullscreen">退出全屏,{{isFullscreen}}</button>-->
<!--        <select @change="onSetQuality">-->
<!--          <option value="普清">普清</option>-->
<!--          <option value="高清">高清</option>-->
<!--          <option value="超清">超清</option>-->
<!--          <option value="4K">4K</option>-->
<!--          <option value="8K">8K</option>-->
<!--        </select>-->
<!--        <select @change="onSetRate">-->
<!--          <option value="1">1</option>-->
<!--          <option value="2">2</option>-->
<!--          <option value="3">3</option>-->
<!--        </select>-->
<!--        <select @change="onSeekTime">-->
<!--          <option value="0">0s</option>-->
<!--          <option value="20">20s</option>-->
<!--          <option value="60">60s</option>-->
<!--          <option value="120">120s</option>-->
<!--        </select>-->
<!--        <button @click="onGetVideoInfo">获取视频信息</button>-->
<!--        <button @click="onGetAudioInfo">获取音频信息</button>-->
<!--        <button @click="onSetMic">设置语音对讲状态</button>-->
<!--        <button @click="onDestroy">关闭视频</button>-->
<!--      </div>-->
<!--    </div>-->
    <div>
      视频信息：{{videoInfo}}
    </div>
    <div>
      音频信息：{{audioInfo}}
    </div>

    <div class="player_box">
      <VueEasyPlayerPro :url="url" :autoplay="true"></VueEasyPlayerPro>
    </div>
  </main>
</template>

<style scoped>
.content-wrap{
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 16px;
}
.play-control{
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  grid-gap: 4px;
}
.play-btns{
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 4px;
}
.player_box {
  position: relative;
  width: 1200px;
  padding-bottom: 56%;
  background-color: #000;
  border: 1px #181818 solid;
}
</style>
