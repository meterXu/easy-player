import {type EasyPlayerConfig, defaultConfig} from "./config";
import {merge} from 'lodash-es'

export type VideoInfo = {
    encType: string
    encTypeCode: number,
    height: number,
    width: number
}

export type AudioInfo = {
    encTypeCode: string
    encType: string,
    channels: number,
    sampleRate: number,
    depth: string,
}

export class EasyPlayer {
    private player: any = null;
    private config: EasyPlayerConfig = {};
    /**
     * 是否销毁
     */
    public isDestroy = false;
    /**
     * 播放事件
     */
    public onPlay = () => {
    }
    /**
     * 暂停事件
     */
    public onPause = () => {
    }
    /**
     * 视频信息回调
     */
    public onVideoInfo = () => {
    }
    /**
     * 音频信息回调
     */
    public onAudioInfo = () => {
    }
    /**
     * 全屏事件
     */
    public onFullscreen = () => {
    }
    /**
     * 音频开关事件
     */
    public onMute = () => {
    }
    /**
     * 当前网速，单位KB每秒1次
     */
    public onKBps = () => {
    }
    /**
     * 切换拉伸事件
     */
    public onStretch = () => {
    }
    /**
     * PTZ事件
     */
    public onPtz = () => {
    }
    /**
     * 截图回调
     */
    public onScreenshots = () => {
    }
    /**
     * 右击关闭回调
     */
    public onContextmenuClose = () => {
    }
    /**
     * 视频编码回调
     */
    public onDecodeHevc = () => {
    }
    /**
     * 直播结束的事件
     */
    public onLiveEnd = () => {
    }
    /**
     * 加载超时事件
     */
    public onTimeout = () => {
    }
    /**
     * 录制结束的事件
     */
    public onRecordEnd = () => {
    }
    /**
     * 录制开始的事件
     */
    public onRecordStart = () => {
    }
    /**
     * 清晰度回调
     */
    public onQualityChange = () => {
    }
    /**
     * 录像时间轴跳转回调
     */
    public onPlaybackSeek = () => {
    }
    /**
     * 录像倍数回调
     */
    public onPlaybackRate = () => {
    }
    /**
     * 播放时间回调
     */
    public onTimestamps = () => {
    }
    /**
     * 播放异常回调
     */
    public onError = () => {
    }

    constructor(container: HTMLElement, config?: EasyPlayerConfig) {
        this.config = merge({}, defaultConfig, config)
        this.player = new window.EasyPlayerPro(container, this.config);
        this.isDestroy = false;
        this.player.on('play', this.onPlay)
        this.player.on('pause', this.onPause)
        this.player.on('videoInfo', this.onVideoInfo)
        this.player.on('audioInfo', this.onAudioInfo)
        this.player.on('fullscreen', this.onFullscreen)
        this.player.on('mute', this.onMute)
        this.player.on('kBps', this.onKBps)
        this.player.on('stretch', this.onStretch)
        this.player.on('ptz', this.onPtz)
        this.player.on('screenshots', this.onScreenshots)
        this.player.on('contextmenuClose', this.onContextmenuClose)
        this.player.on('decodeHevc', this.onDecodeHevc)
        this.player.on('liveEnd', this.onLiveEnd)
        this.player.on('timeout', this.onTimeout)
        this.player.on('recordEnd', this.onRecordEnd)
        this.player.on('recordStart', this.onRecordStart)
        this.player.on('qualityChange', this.onQualityChange)
        this.player.on('playbackSeek', this.onPlaybackSeek)
        this.player.on('playbackRate', this.onPlaybackRate)
        this.player.on('timestamps', this.onTimestamps)
        this.player.on('error', this.onError)
    }

    /**
     * 播放
     * @param url 播放地址
     */
    play(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                if (this.player) {
                    this.player.play(url).then(resolve).catch(reject)
                } else {
                    reject('player is null')
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * 暂停播放
     */
    pause() {
        this.player && this.player.pause()
    }

    /**
     * 返回是否暂停中状态
     */
    isPause(): boolean | null {
        if (!this.player)
            return null
        return this.player.isPause()
    }

    /**
     * 音频切换
     * @param isMute
     */
    setMute(isMute: boolean) {
        this.player && this.player.setMute(isMute)
    }

    /**
     * 是否静音
     */
    isMute(): boolean | null {
        if (!this.player)
            return null
        return this.player.isMute()
    }

    /**
     * 获取快照
     * @param name 名称（默认时间戳）
     * @param type 类型（png|jpg，默认png）
     * @param rato 压缩了（0-1，默认0.92）
     * @param format 数据格式（download，base64，blob，默认download）
     */
    screenshot(name?: string, type?: string, rato?: number, format?: string): string | Blob | null {
        if (!this.player)
            return null
        return this.player.screenshot(name, type, rato, format)
    }

    /**
     * 全屏（取消全屏）播放视频
     * @param isFullscreen 是否全屏
     */
    setFullscreen(isFullscreen: boolean) {
        this.player && this.player.setFullscreen(isFullscreen)
    }

    /**
     * 推出全屏
     */
    exitFullscreen() {
        this.player && this.player.exitFullscreen()
    }

    /**
     * 设置分辨率，分辨率必须是quality里面的数据
     * @param quality
     */
    setQuality(quality: string) {
        this.player && this.player.setQuality(quality)
    }

    /**
     * 设置录像倍数
     * @param rate
     */
    setRate(rate: number) {
        this.player && this.player.setRate(rate)
    }

    /**
     * 设置录像跳转时间（s）
     */
    seekTime(time: number) {
        this.player && this.player.seekTime(time)
    }

    /**
     * 获取视频信息
     */
    getVideoInfo(): VideoInfo | null {
        if (!this.player)
            return null
        return this.player.getVideoInfo()
    }

    /**
     * 获取音频信息
     */
    getAudioInfo(): AudioInfo | null {
        if (!this.player)
            return null
        return this.player.getAudioInfo()
    }

    /**
     * 设置语音对讲状态（PTZ需开启）
     * @param isMic
     */
    setMic(isMic: boolean) {
        this.player && this.player.setMic(isMic)
    }

    /**
     * 关闭视频，释放底层资源
     */
    destroy() {
        this.player && this.player.destroy()
        this.player = null
        this.isDestroy = true
    }
}
