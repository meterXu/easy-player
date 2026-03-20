# vue-easy-player-pro

## 简介
基于vue3的EasyPlayer.js二次封装。

EasyPlayer.js H5播放器，是一款能够同时支持HTTP、HTTP-FLV、HLS（m3u8）、WS、WEBRTC、FMP4视频直播与视频点播等多种协议，支持H.264、H.265、AAC、G711A、Mp3等多种音视频编码格式，支持MSE、WASM、WebCodec等多种解码方式，支持Windows、Linux、Android、iOS全平台终端的H5播放器，使用简单, 功能强大。

## 快速开始

**安装**
```bash
npm i easy-player-pro
npm i vue-easy-player-pro
npm i -D vite-plugin-easy-player-pro
# or
yarn add easy-player-pro
yarn add vue-easy-player-pro
yarn add vite-plugin-easy-player-pro -D
```
**使用**
```vue
<script setup>
  import {shallowReactive} from 'vue'
  import VueEasyPlayerPro from "vue-easy-player-pro";
  const urls = shallowReactive([
    'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8'
  ])
</script>
<template>
  <VueEasyPlayerPro class="player-pro" ref="easyPlayer"
                    :urls="urls" :autoplay="false"
                    :split="1"
  ></VueEasyPlayerPro>
</template>
<style scoped>
  .player-pro{
    width: 1200px;
  }
</style>
```


**vite配置**
```javascript
import easyPlayerPro from 'vite-plugin-easy-player-pro'
export default defineConfig({
    plugins:[
        easyPlayerPro()
    ]
})
```

## 配置属性 config

| 参数             | 说明                       | 类型       | 默认值                                                                |
|----------------|--------------------------|----------|--------------------------------------------------------------------|
| isLive         | 是否直播                     | Boolean  | true                                                               |
| hasAudio       | 是否解析音频                   | Boolean  | true                                                               |
| mute           | 是否静音                     | Boolean  | true                                                               |
| stretch        | 视频拉伸                     | Boolean  | false                                                              |
| split          | 分屏数                      | Number   | 1                                                                  |
| autoplay       | 自动播放。若为true，urls不可为空     | Boolean  | false                                                              |
| urls           | 初始视频链接                   | String[] | []                                                                 |
| config | easy-player-pro配置选项      | Object   | {}                                                                 |


## 事件回调

示例:
```js
easyPalyer.value.playerList[0].onPlay=()=>{
    console.log('play started')
}
```

## 方法

示例:
```js
easyPalyer.value.playerList[0].screenshot("test", "png", 0.5, 'base64')
```
