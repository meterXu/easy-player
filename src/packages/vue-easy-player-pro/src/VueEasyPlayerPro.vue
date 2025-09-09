<script setup lang="ts">
import {onMounted, onUnmounted, ref, shallowReactive} from "vue";
import type {PropType} from 'vue'
import EasyPlayerPro from "@/packages/easy-player-pro";

const props = defineProps({
  urls: {
    default: [],
    type: [] as PropType<string[]>
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
    values: [1, 4, 9, 16, 25, 66]
  },
  config: {
    default: () => {
      return {}
    },
    type: Object as PropType<InstanceType<typeof EasyPlayerPro>>
  }
})

const easyPlayerRef = ref()
const playerWrapRef = ref()

const playerList = shallowReactive<InstanceType<typeof EasyPlayerPro>[]>([])
onMounted(() => {
  playerList.push(...easyPlayerRef.value.map((ele: HTMLElement,index:number) => {
    const _player = new EasyPlayerPro(ele, {
      isLive: props.isLive,
      isMute: !props.mute,
      stretch: props.stretch,
      ...props.config
    })
    if (props.autoplay) {
      _player.play(props.urls[index])
    }
    return _player
  }))
})
onUnmounted(() => {
  playerList.map(player => {
    if (!player.isDestroy) {
      player.destroy()
    }
  })
  playerList.splice(0, playerList.length)
})

defineExpose({
  playerList:playerList
})
</script>

<template>
  <div ref="playerWrapRef" class="player_container" :class="`player_container_${props.split}`">
    <div class="player-item" v-for="(item,index) in props.split" :key="index">
      <div class="player-box" ref="easyPlayerRef"></div>
    </div>
  </div>
</template>

<style scoped>
.player_container {
  display: grid;
}

.player_container_1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.player_container_2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.player_container_4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.player_container_9 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.player_container_16 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}

.player_container_25 {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
}

.player_container_36 {
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
}

.player-item {
  position: relative;
  padding-bottom: 56%;
}

.player-box {
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