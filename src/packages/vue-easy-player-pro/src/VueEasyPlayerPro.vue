<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";
import EasyPlayerPro from "easy-player-pro";

const props = defineProps({
  url:{
    default:'',
    type:String
  },
  isLive:{
    default:true,
    type:Boolean
  },
  autoplay:{
    default:false,
    type:Boolean
  },
  mute:{
    default:true,
    type:Boolean
  },
  stretch:{
    default:false,
    type:Boolean
  },
  config:{
    default:()=>{
      return {}
    },
    type:Object
  }
})

const easyPlayerRef = ref()

let player = ref<InstanceType<typeof EasyPlayerPro> | null>(null)
onMounted(()=>{
  player.value = new EasyPlayerPro(easyPlayerRef.value,{
    isLive:props.isLive,
    isNotMute:!props.mute,
    stretch:props.stretch,
    ...props.config
  })
  if(props.autoplay){
    player.value.play(props.url)
  }
})
onUnmounted(()=>{
  if(player&&!player.value?.isDestroy){
    player.value?.destroy()
  }
})

defineExpose({
  player
})
</script>

<template>
<div ref="easyPlayerRef"></div>
</template>

<style scoped>
</style>