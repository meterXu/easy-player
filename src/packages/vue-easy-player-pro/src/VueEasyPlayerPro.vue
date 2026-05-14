<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref, shallowReactive, watch} from "vue";
import {EasyPlayerProConfigType, EasyPlayerProType} from "../../easy-player-pro/src/index";
import EasyPlayerPro from "../../easy-player-pro/src/index";
const {urls=[],isLive=true,autoplay=false,hasAudio=true,mute=true,stretch=false,split=1,config={}} = defineProps<{
  urls?: string[],
  isLive?: boolean,
  autoplay?: boolean,
  hasAudio?: boolean,
  mute?: boolean,
  stretch?: boolean,
  split?: number,
  config?: EasyPlayerProConfigType|EasyPlayerProConfigType[]
}>()

const easyPlayerRef = ref()
const playerWrapRef = ref()
const reset = ref(true)
const playerList = shallowReactive<EasyPlayerProType[]>([])

function initPlayerList(){
  playerList.push(...easyPlayerRef.value.map((ele: HTMLElement,index:number) => {
    const _player = new EasyPlayerPro(ele, Object.assign({
      isLive: isLive,
      isMute: !mute,
      stretch: stretch,
    }, config instanceof Array ? config[index] : config))
    if (autoplay) {
      _player.play(urls[index])
    }
    return _player as unknown as EasyPlayerProType
  }))
}

function cleanPlayerList(){
  playerList.map(player => {
    if (!player.isDestroy) {
      player.destroy()
    }
  })
  playerList.splice(0, playerList.length)
}

watch(()=>split,(nv)=>{
  if(nv){
    reset.value = false
    cleanPlayerList()
    nextTick(()=>{
      reset.value = true
      nextTick(()=>{
        initPlayerList()
      })
    })
  }
})
onMounted(() => {
  initPlayerList()
})

onUnmounted(() => {
  cleanPlayerList()
})

defineExpose({
  playerList:playerList
})
</script>

<template>
  <div ref="playerWrapRef" class="easy-player-pro player_container" :class="`easy-player-pro_${split}`">
    <div v-if="reset" class="player-item" v-for="(item,index) in split" :key="index">
      <div class="player-box" ref="easyPlayerRef"></div>
      <slot :index="index" :player="playerList[index]">
      </slot>
    </div>
  </div>
</template>
<style scoped>
.easy-player-pro {
  display: grid;
}
.easy-player-pro.easy-player-pro_1{
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
.easy-player-pro.easy-player-pro_2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.easy-player-pro.easy-player-pro_4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.easy-player-pro.easy-player-pro_9 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.easy-player-pro.easy-player-pro_16 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}

.easy-player-pro.easy-player-pro_25 {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
}

.easy-player-pro.easy-player-pro_36 {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
}

.easy-player-pro .player-item {
  position: relative;
  padding-bottom: 56%;
}

.easy-player-pro .player-box {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #000;
  border: 1px #181818 solid;
}
</style>