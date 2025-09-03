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
  }
})

const easyPlayerRef = ref()

let player:InstanceType<typeof EasyPlayerPro> | null = null
onMounted(()=>{
  player = new EasyPlayerPro(easyPlayerRef.value)
  debugger
  if(props.autoplay){
    player.play(props.url)
  }
})
onUnmounted(()=>{
  if(player&&!player.isDestroy){
    player.destroy()
  }
})
</script>

<template>
<div ref="easyPlayerRef" class="easy-player"></div>
</template>

<style scoped>
.easy-player{
  width: 100%;
  height: 100%;
}
</style>