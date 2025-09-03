<script setup lang="ts">
import {ref, onMounted,onUnmounted} from 'vue'
import EasyPlayer,{type VideoInfo,type AudioInfo} from "../packages/easy-player/src/index.ts";

const playerRef = ref()
const isMute = ref(true)
const isPause = ref(true)
const isFullscreen = ref(false)
const url = ref('https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8')
const videoInfo = ref()
const audioInfo = ref()

let easyPlayer = null as any
onMounted(() => {
  easyPlayer = new EasyPlayer(playerRef.value)
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
  // easyPlayer.onKBps=(KBps:number)=>{
  //   console.log(`kBps event,${KBps}`)
  // }
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
})

onUnmounted(()=>{
  easyPlayer&&easyPlayer.destroy()
})

function onPlay() {
  if(easyPlayer.isDestroy){
    easyPlayer =  new EasyPlayer(playerRef.value)
  }
  url.value&&easyPlayer.play(url.value).then(()=>{
    isPause.value = easyPlayer.isPause()
    isMute.value = easyPlayer.isMute()
  })
}
function onPause(){
  easyPlayer.pause()
  isPause.value = easyPlayer.isPause()
  isMute.value = easyPlayer.isMute()
}

function onMute() {
  easyPlayer.setMute(!isMute.value)
  isPause.value = easyPlayer.isPause()
  isMute.value = easyPlayer.isMute()
}

function onScreenshot(){
  let res = easyPlayer.screenshot('test','jpg',0.5,'blob')
  res&&downloadFileByBlob('test',res)
}

function onSetFullscreen(){
  isFullscreen.value = !isFullscreen.value
  easyPlayer.setFullscreen(isFullscreen.value)
}

function onexitFullscreen(){
  easyPlayer.exitFullscreen()
  isFullscreen.value = false
}

function onSetQuality(event:any){
  easyPlayer.setQuality(event.target.value)
}

function onSetRate(event:any){
  easyPlayer.setRate(event.target.value)
}

function onSeekTime(event:any){
  easyPlayer.seekTime(event.target.value)
}

function onGetVideoInfo(){
  videoInfo.value = easyPlayer.getVideoInfo()
}

function onGetAudioInfo(){
  audioInfo.value = easyPlayer.getAudioInfo()
}

function onSetMic(){
  easyPlayer.setMic(true)
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
      <input v-model="url" style="width: 100%"/>
      <div class="play-btns">
        <button @click="onPlay">播放</button>
        <button @click="onPause">暂停,{{isPause}}</button>
        <button @click="onMute">切换静音,{{isMute}}</button>
        <button @click="onScreenshot">获取快照</button>
        <button @click="onSetFullscreen">切换全屏,{{isFullscreen}}</button>
        <button @click="onexitFullscreen">退出全屏,{{isFullscreen}}</button>
        <select @change="onSetQuality">
          <option value="普清">普清</option>
          <option value="高清">高清</option>
          <option value="超清">超清</option>
          <option value="4K">4K</option>
          <option value="8K">8K</option>
        </select>
        <select @change="onSetRate">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <select @change="onSeekTime">
          <option value="0">0s</option>
          <option value="20">20s</option>
          <option value="60">60s</option>
          <option value="120">120s</option>
        </select>
        <button @click="onGetVideoInfo">获取视频信息</button>
        <button @click="onGetAudioInfo">获取音频信息</button>
        <button @click="onSetMic">设置语音对讲状态</button>
        <button @click="onDestroy">关闭视频</button>
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
