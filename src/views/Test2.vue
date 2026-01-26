<script setup lang="ts">
import {ref, onUnmounted, nextTick, shallowReactive} from 'vue'
import VueEasyPlayerPro from "@/packages/vue-easy-player-pro/src";

const isMute = ref(true)
const urls = shallowReactive([
  'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8'
])
const videoInfo = ref()
const audioInfo = ref()
const easyPlayer = ref()
const split = ref(1)
const reset = ref(true)

function onPlay() {
  easyPlayer.value.playerList.map((c: any,index:number) => {
    c.play(urls[index])
  })
}

function onPause() {
  easyPlayer.value.playerList.map((c: any,index:number) => {
    c.pause()
  })
}

function onMute() {
  isMute.value = !isMute.value
  easyPlayer.value.playerList.map((c: any,index:number) => {
    c.setMute(isMute.value)
  })
}

function onSplit(_split:number){
  reset.value = false
  nextTick(()=>{
    split.value=_split
    urls.splice(0,urls.length)
    urls.push(...Array.from(new Array(split.value),(_x:any,index:number)=>{
      return "https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8"
    }))
    reset.value = true
  })
}

onUnmounted(() => {
  easyPlayer.value.playerList.map((c: any) => {
    c.destroy()
  })
})
</script>

<template>
  <main class="content-wrap">
    <div class="play-control">
      <input v-for="(item,index) in urls" v-model="urls[index]" style="width: 100%"/>
      <div class="play-btns">
        <button @click="onPlay">播放</button>
        <button @click="onPause">暂停</button>
        <button @click="onMute">切换静音</button>
        <button @click="onSplit(1)">单屏</button>
        <button @click="onSplit(2)">双屏</button>
        <button @click="onSplit(4)">四分屏</button>
        <button @click="onSplit(9)">九分屏</button>
        <button @click="onSplit(16)">十六分屏</button>
      </div>
    </div>
    <VueEasyPlayerPro v-if="reset" class="player-pro" ref="easyPlayer"
                      :urls="urls" :autoplay="true"
                      :split="split"
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

.player-pro {
  width: 1200px;
}
</style>
