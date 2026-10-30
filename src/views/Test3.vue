<script setup lang="ts">
import {ref, onMounted, onUnmounted, reactive} from 'vue'
//@ts-ignore
import EasyPlayerPro,{type VideoInfo,type AudioInfo} from "@/packages/easy-player-pro/src/index.ts";
import type {ZoomSelectInfoType} from "@/packages/easy-player-pro/src/core/easy-player-pro.ts";

const playerRef = ref()
const isMute = ref(true)
const isPause = ref(false)
const isFullscreen = ref(false)
const isSuperResolution = ref(false)
const videoInfo = ref()
const audioInfo = ref()
const agoraConfig = reactive({
  appid:'a7640e0ea278487892fb151c9117d169',
  token:'007eJxTYKi7b8F9bFNIvbaPstrflsSQO0I/J1+cnch3ZFKHnVqg2AUFhkRzMxODVIPURCNzCxMLcwtLo7QkQ1PDZEtDQ/MUQzNLg8AnWQ2BjAzP9jgxMjJAIIjPxpBWkZaSlcnAAAAl/x7Z',
  channel:'fxfdji',
})

let easyPlayer = null as any
onMounted(() => {
  //@ts-ignore
  easyPlayer = new EasyPlayerPro(playerRef.value,{isAgora: true,agoraConfig})
  easyPlayer.onPlay=()=>{
    console.log('play event')
  }
  easyPlayer.onPause=()=>{
    console.log('pause event')
  }
  easyPlayer.onVideoInfo=(videoInfo:VideoInfo)=>{
    console.log(`videoInfo event,${JSON.stringify(videoInfo)}`)
  }
  easyPlayer.onAudioInfo=(audioInfo:AudioInfo)=>{
    console.log(`audioInfo event,${JSON.stringify(audioInfo)}`)
  }
  easyPlayer.onFullscreen=(isFullscreen:boolean)=>{
    console.log(`fullscreen event,${isFullscreen}`)
  }
  easyPlayer.onMute=(isMute:boolean)=>{
    console.log(`mute event,${isMute}`)
  }
  easyPlayer.onKBps=(KBps:number)=>{
    // console.log(`kBps event,${KBps}`)
  }
  easyPlayer.onStretch=(isStretch:boolean)=>{
    console.log(`stretch event,${isStretch}`)
  }
  easyPlayer.onPTZ=(ptz:any)=>{
    console.log(`ptz event,${ptz}`)
  }
  easyPlayer.onScreenshots=()=>{
    console.log(`screenshots event`)
  }
  easyPlayer.onContextmenuClose=()=>{
    console.log(`contextmenuClose event`)
  }
  easyPlayer.onDecodeHevc=()=>{
    console.log(`decodeHevc event`)
  }
  easyPlayer.onLiveEnd=()=>{
    console.log('liveEnd event')
  }
  easyPlayer.onTimeout=()=>{
    console.log('timeout event')
  }
  easyPlayer.onRecordEnd=()=>{
    console.log('recordEnd event')
  }
  easyPlayer.onRecordStart=()=>{
    console.log('recordStart event')
  }
  easyPlayer.onQualityChange=(quality:string)=>{
    console.log(`qualityChange event,${quality}`)
  }
  easyPlayer.onPlaybackSeek=()=>{
    console.log('playbackSeek event')
  }
  easyPlayer.onPlaybackRate=()=>{
    console.log('playbackRate event')
  }
  easyPlayer.onTimestamps=()=>{
    console.log('timestamps event')
  }
  easyPlayer.onError=(err:any)=>{
    console.log(`error event,${err}`)
  }
  easyPlayer.onDblclickPosition=(position:any)=>{
    console.log(`dblclickPosition event,${JSON.stringify(position)}`)
  }
  easyPlayer.onZoomSelect=(info:ZoomSelectInfoType)=>{
    console.log(info)
  }
})

onUnmounted(()=>{
  easyPlayer&&easyPlayer.destroy()
})

function onPlay() {
  if(easyPlayer.isDestroy){
    easyPlayer =  new EasyPlayerPro(playerRef.value,{isAgora: true,agoraConfig})
  }
  easyPlayer.agoraPlay(agoraConfig.appid,agoraConfig.channel,agoraConfig.token).then(()=>{
    isPause.value = easyPlayer.isPause()
    isMute.value = easyPlayer.isMute()
  })
}
function onPause(){
  easyPlayer.pause()
  isPause.value = easyPlayer.isPause()
  isMute.value = easyPlayer.isMute()
}

function onSuperResolution(){
  easyPlayer.setSuperResolution(!isSuperResolution.value)
  isSuperResolution.value = !isSuperResolution.value
}

function onGetVideoInfo(){
  videoInfo.value = easyPlayer.getVideoInfo()
}

function onGetAudioInfo(){
  audioInfo.value = easyPlayer.getAudioInfo()
}

function onDestroy(){
  easyPlayer.destroy()
}

function downloadFileByUrl(name:string, url:string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
}
function downloadFileByBlob(name:string, blob:Blob) {
  if (!(blob instanceof Blob)) {
    console.error('blob is not instance of Blob');
  }
  else {
    const url = window.URL.createObjectURL(blob);
    downloadFileByUrl(name, url);
  }
}
</script>

<template>
  <main class="content-wrap">
    <div class="play-control">
      <div>
        声网配置：appid：<input v-model="agoraConfig.appid"/> channel：<input v-model="agoraConfig.channel"/> token：<input v-model="agoraConfig.token"/>
      </div>
      <div class="play-btns">
        <button @click="onPlay">播放</button>
        <button @click="onPause">暂停,{{isPause}}</button>
        <button @click="onSuperResolution">画质增强,{{isSuperResolution}}</button>
        <button @click="onDestroy">关闭视频</button>
        <button @click="onGetVideoInfo">获取视频信息</button>
        <button @click="onGetAudioInfo">获取音频信息</button>
      </div>
    </div>
    <div>
      视频信息：{{videoInfo}}
    </div>
    <div>
      音频信息：{{audioInfo}}
    </div>
    <div class="player_box" ref="playerRef"></div>
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
