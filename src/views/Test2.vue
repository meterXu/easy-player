<script setup lang="ts">
import {ref, onUnmounted} from 'vue'
import VueEasyPlayerPro from "@/packages/vue-easy-player-pro";

const isMute = ref(true)
const url = ref('https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8')
const videoInfo = ref()
const audioInfo = ref()

let easyPlayer = ref()

function onPlay() {
  easyPlayer.value.map((c: any) => {
    c.play(url.value)
  })
}

function onPause() {
  easyPlayer.value.map((c: any) => {
    c.pause()
  })
}

function onMute() {
  isMute.value = !isMute.value
  easyPlayer.value.map((c: any) => {
    c.setMute(isMute.value)
  })
}

onUnmounted(() => {
  easyPlayer.value.map((c: any) => {
    c.destroy()
  })
})
</script>

<template>
  <main class="content-wrap">
    <div class="play-control">
      <input v-model="url" style="width: 100%"/>
      <div class="play-btns">
        <button @click="onPlay">播放</button>
        <button @click="onPause">暂停</button>
        <button @click="onMute">切换静音</button>
      </div>
    </div>
    <div>
      视频信息：{{ videoInfo }}
    </div>
    <div>
      音频信息：{{ audioInfo }}
    </div>
    <VueEasyPlayerPro class="player_wrap" ref="easyPlayer"
                      :url="url" :autoplay="true"
                      :split="9"
                      :cols="3"
                      :width="400"
                      :height="400*0.56"
    ></VueEasyPlayerPro>
  </main>
</template>

<style scoped>
.content-wrap {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: center;
  grid-gap: 16px;
}

.play-control {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  grid-gap: 4px;
}

.play-btns {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 4px;
}
</style>
