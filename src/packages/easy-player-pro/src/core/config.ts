export const defaultConfig = {
    /**
     * 是否直播
     */
    isLive:true,
    /**
     * 是否解析音频
     */
    hasAudio:true,
    /**
     * 是否渲染音频
     */
    isMute:false,
    /**
     * 视频拉伸
     */
    stretch:false,
    /**
     * 视频封面图片
     */
    poster:true,
    /**
     * 加载显设置最小缓冲时长，单位秒，播放器会自动消除延迟。
     */
    bufferTime:true,
    /**
     * 视频加载超时,单位秒。
     */
    loadTimeOut:10,
    /**
     * 重连次数 -1为一直加载。
     */
    loadTimeReplay:3,
    /**
     * MSE模式
     */
    MSE:true,
    /**
     * WCS模式
     */
    WCS:true,
    /**
     * WASM模式
     */
    WASM:true,
    /**
     * WASMSIMD模式
     */
    WASMSIMD:true,
    /**
     * 硬解码
     */
    gpuDecoder:false,
    /**
     * 渲染方式
     */
    webGPU:false,
    /**
     * 渲染容器
     */
    canvasRender:false,
    /**
     * SRS类型
     */
    isRtcSRS:false,
    /**
     * ZLM类型
     */
    isRtcZLM:false,
    /**
     * 裸流
     */
    isFlow:false,
    /**
     * 水印
     */
    watermark:{
        text:{
            content:'',
            angle:'',
            color:'',
            fontSize:'',
            opacity:''
        },
        right:0,
        top:0
    },
    /**
     * 全屏水印
     */
    fullWatermark:{
        text:'',
        angle:'',
        color:'',
        fontSize:'',
        opacity:'',
    },
    /**
     * 配置清晰
     */
    quality:['普清', '高清', '超清', '4K', '8K'],
    /**
     * 默认显示的清晰度，如果不设置，会显示第一个清晰度
     */
    defaultQuality:null,
    /**
     * PTZ配置
     */
    ptzConfig:{
        ptz:false,
        ptzMore:false
    },
    /**
     * 控制台日志打印
     */
    debug:false,
    /**
     * 是否显示网络状态
     */
    isBand:false,
    /**
     * 按钮列表
     */
    btns:{
        fullscreen:true,
        screenshot:true,
        play:true,
        audio:true,
        record:true,
        stretch:true,
        zoom:true,
        ptz:false,
        quality:false,
    }
}
export type EasyPlayerProConfig = Partial<typeof defaultConfig>




