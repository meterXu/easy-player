<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {easyPlayer} from "@/packages/easy-player/src/index.ts";

const playerRef = ref()
const isMute = ref(true)
let player = null as any
onMounted(() => {
  player = new easyPlayer(playerRef.value, {
    hasAudio: true,
    stretch: false,
  })
  player.play('https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8')
})

function toggleMute() {
  isMute.value = !isMute.value
  player.setMute(isMute.value)
}
</script>

<template>
  <main style="width: 1200px;">
    <button @click="toggleMute">静音切换,{{isMute}}</button>
    <div class="player_box" ref="playerRef"></div>
  </main>
</template>

<style>
.player_box {
  position: relative;
  padding-bottom: 56%;
  background-color: #000;
  border: 1px #181818 solid;
}
</style>
