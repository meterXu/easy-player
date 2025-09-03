# easy-player-pro

## 简介
基于EasyPlayer.js的二次封装，增加类型说明，支持在前端工程项目中安装使用。

EasyPlayer.js H5播放器，是一款能够同时支持HTTP、HTTP-FLV、HLS（m3u8）、WS、WEBRTC、FMP4视频直播与视频点播等多种协议，支持H.264、H.265、AAC、G711A、Mp3等多种音视频编码格式，支持MSE、WASM、WebCodec等多种解码方式，支持Windows、Linux、Android、iOS全平台终端的H5播放器，使用简单, 功能强大。

## 快速开始

**安装**
```bash
npm i easy-player-pro
# or
yarn add easy-player-pro
```
**使用**
```javascript
import EasyPlayerPro from "easy-player-pro";
// 初始化
const easyPalyer = new EasyPlayerPro("#palyer-box",{
    isMute:true,
    hasAuto:false
})
// 事件监听
easyPalyer.onPlay=()=>{
    console.log('play event');
}
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


| 参数               | 说明                                             | 类型                       | 默认值                                                                    |
| ------------------ | ------------------------------------------------ | -------------------------- |------------------------------------------------------------------------|
| isLive | 是否直播 | Boolean | true                                                                   |
| hasAudio | 是否解析音频 | Boolean | true                                                                   |
| isNotMute | 是否不静音 | Boolean | false                                                                  |
| stretch | 视频拉伸 | Boolean | false                                                                  |
| poster             | 视频封面图片                                     | String                     | -                                                                      |
| bufferTime                | 加载显设置最小缓冲时长，单位秒，播放器会自动消除延迟。       | Number                     | 1                                                                      |
| loadTimeOut                | 视频加载超时,单位秒。    | Number                     | 10                                                                     |
| loadTimeReplay                | 重连次数 -1为一直加载。    | Number                     | 3                                                                      |
| MSE | MSE模式 | Boolean | fasle                                                                  |
| WCS | WCS模式 | Boolean | fasle                                                                  |
| WASM | WASM模式 | Boolean | fasle                                                                  |
| WASMSIMD |WASMSIMD模式                                     | Boolean                    | false                                                                  |
| gpuDecoder |硬解码                                    | Boolean                    | false                                                                  |
| webGPU |渲染方式                                       | Boolean                    | false                                                                  |
| canvasRender |渲染容器                                   | Boolean                    | false                                                                  |
| isRtcSRS |SRS类型                                   | Boolean                    | false                                                                  |
| isRtcZLM |ZLM类型                                   | Boolean                    | false                                                                  |
| isFlow | 裸流 | Boolean | false                                                                  |
| watermark         | 水印      | Object | {text: {content:'',color:'',opacity:,fontSize:''},right: 0,top: 0} |
| fullWatermark         | 全屏水印      | Object | {text: '',angle:'',color:'',fontSize: '',opacity:''}               |
| quality         | 配置清晰      | Array | ['普清', '高清', '超清', '4K', '8K']                                         |
| defaultQuality  |  默认显示的清晰度，如果不设置，会显示第一个清晰度                                    | String | -                                                                      |
| ptzConfig         | PTZ配置      | Object | {ptz: true, ptzMore: true}                                             |
| debug | 控制台日志打印 | Boolean | false                                                                  |
注:

    1.解码模式 MSE > WCS > wasm(simd适合高分辨率)

## 事件回调

| 事件名              | 说明         |
|------------------| ------------ |
| onPlay           | 播放事件      |
| onPause          | 暂时事件      |
| videoInfo        | 视频信息      |
| onVideoInfo      | 音频信息      |
| onFullscreen     | 全屏      |
| onMute           | 音频      |
| onKBps           | 当前网速， 单位KB 每秒1次,      |
| onStretch        | 切换拉伸    |
| onPTZ            | PTZ事件    |
| onScreenshots      | 截图回调    |
| onContextmenuClose | 右击关闭回调    |
| onDecodeHevc       | 视频编码回调    |
| onLiveEnd          | 直播结束的事件    |
| onTimeout          | 加载超时    |
| onRecordEnd        | 录制结束的事件    |
| onRecordStart      | 录制开始的事件    |
| onQualityChange    | 清晰度回调 |
| onPlaybackSeek     | 录像时间轴跳转回调 |
| onPlaybackRate     | 录像倍数的回调 |
| onTimestamps       | 播放时间回调 |
| onError            | 播放异常      |

## 方法

| 方法名      | 说明         | 参数                  |
| ---------- | ------------ | ---------------------|
| play         | 播放      |         'url'            |
| pause      | 暂停播放    |               |
| isPause      | 返回是否暂停中状态    |               |
| setMute      | 音频    |      true|false         |
| isMute      |  返回是否静音    |               |
| screenshot         | 获取快照      |('test', 'png \| jpeg', '0-1(压缩率)','download \| base64 \| blob')|
| setFullscreen      |  全屏(取消全屏)播放视频    |               |
| exitFullscreen      | 退出全屏    |               |
| setQuality      |  设置分辨率必须是quality里面的数据    |               |
| setRate      |  设置录像倍数    |               |
| seekTime      |  设置录像跳转时间/s     |               |
| getVideoInfo      |  获取视频信息    |               |
| getAudioInfo      |  获取音频信息    |               |
| setMic      | 设置语音对讲状态(PTZ需开启)    |   true|
| destroy      | 关闭视频，释放底层资源    |               |

screenshot 截图，调用后弹出下载框保存截图

    filename: 可选参数, 保存的文件名, 默认 时间戳
    format : 可选参数, 截图的格式，可选png或jpeg或者webp ,默认 png
    quality: 可选参数, 当格式是jpeg或者webp时，压缩质量，取值0 ~ 1 ,默认 0.92
    type: 可选参数, 可选download或者base64或者blob，默认download
案例:
```js
const base64 = easyPalyer.screenshot("test", "png", 0.5, 'base64')
```
