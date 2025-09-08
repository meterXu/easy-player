<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, shallowReactive} from "vue";
import type { PropType } from 'vue'
import EasyPlayerPro from "@/packages/easy-player-pro";

const EasyPlayerProType = EasyPlayerPro as PropType<InstanceType<typeof EasyPlayerPro>>

const props = defineProps({
  url: {
    default: '',
    type: String
  },
  isLive: {
    default: true,
    type: Boolean
  },
  autoplay: {
    default: false,
    type: Boolean
  },
  hasAudio: {
    default: true,
    type: Boolean
  },
  mute: {
    default: true,
    type: Boolean
  },
  stretch: {
    default: false,
    type: Boolean
  },
  split: {
    default: 1,
    type: Number,
  },
  rows:{
    type: Number,
  },
  cols:{
    type: Number,
  },
  width:{
    default: 1200,
    type: Number
  },
  height:{
    default: 576,
    type: Number
  },
  config: {
    default: () => {
      return {}
    },
    type: Object
  }
})

const easyPlayerRef = ref()
const playerWrapRef = ref()
const flow = computed(()=>{
  return props.direction==='horizontal'?'row':'column'
})

let playerList = shallowReactive<InstanceType<typeof EasyPlayerPro>[]>([])
onMounted(() => {
  playerList.push(...easyPlayerRef.value.map((ele: HTMLElement) => {
    const _player = new EasyPlayerPro(ele, {
      isLive: props.isLive,
      isMute: !props.mute,
      stretch: props.stretch,
      ...props.config
    })
    if (props.autoplay) {
      _player.play(props.url)
    }
    return _player
  }))
})
onUnmounted(() => {
  playerList.map(player => {
    if (player.isDestroy) {
      player.destroy()
    }
  })
})

defineExpose(playerList)
</script>

<template>
<div ref="playerWrapRef" class="player-wrap" :style="{'--cols':props.cols,'--rows':props.rows}">
  <div class="player-box" ref="easyPlayerRef"
       v-for="(item,index) in props.split" :key="index"
       :style="{'--width':`${props.width}px`,'--height':`${props.height}px`}"
  ></div>
</div>
</template>

<style scoped>
.player-wrap {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
  grid-template-rows: repeat(var(--rows), 1fr);
  grid-gap: 12px;
}
.player-box{
  background-color: #000;
  border: 1px #181818 solid;
  width: var(--width);
  height: var(--height);
}
</style>