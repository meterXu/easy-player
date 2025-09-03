<script setup lang="ts">
import {ref,onMounted} from "vue";
import EasyPlayerPro from "easy-player-pro";

const props = defineProps({
  isLive:{
    default:true,
    type:Boolean
  },
})

const easyPlayerRef = ref()

let player = null
onMounted(()=>{
  player = new EasyPlayerPro(easyPlayerRef.value)
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