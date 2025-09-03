<script setup lang="ts">
import {onMounted} from "vue";


const props = defineProps({
  isLive:{
    default:true,
    type:Boolean
  },
})

const easyPlayerRef = ref()

let player = null
onMounted(()=>{
  easyPlayer = new VueEasyPlayer(easyPlayerRef.value)
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