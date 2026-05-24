import {type EasyPlayerProConfig, defaultConfig} from "./config";
import {mergeWith} from 'lodash-es'

export type VideoInfoType = {
    encType: string
    encTypeCode: number,
    height: number,
    width: number
}

export type AudioInfoType = {
    encTypeCode: string
    encType: string,
    channels: number,
    sampleRate: number,
    depth: string,
}

export class EasyPlayerPro {
    private player: any = null;
    private config: EasyPlayerProConfig = {};
    private container: HTMLElement;
    private _url = ''
    private videoElement: HTMLVideoElement;
    private controller: AbortController
    private signal: AbortSignal
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
    public onVideoInfo = (videoInfo: VideoInfoType) => {
    }
    /**
     * 音频信息回调
     */
    public onAudioInfo = (audioInfo: AudioInfoType) => {
    }
    /**
     * 全屏事件
     */
    public onFullscreen = (isFullscreen: boolean) => {
    }
    /**
     * 音频开关事件
     */
    public onMute = (isMute: boolean) => {
    }
    /**
     * 当前网速，单位KB每秒1次
     */
    public onKBps = (KBps: number) => {
    }
    /**
     * 切换拉伸事件
     */
    public onStretch = (isStretch: boolean) => {
    }
    /**
     * PTZ事件
     */
    public onPTZ = (ptz: any) => {
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
    public onQualityChange = (quality: string) => {
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
    public onError = (err: any) => {
    }

    constructor(container: HTMLElement, config?: EasyPlayerProConfig) {
        this.config = mergeWith({}, defaultConfig, config,(objValue, srcValue) => {
            if (Array.isArray(objValue)) {
                return srcValue;
            }
        })
        this.container = container
        //@ts-ignore
        this.player = new window.EasyPlayerPro(this.container, this.config);
        this.videoElement = this.player.$container.querySelector('video');
        this.isDestroy = false;
        this.controller = new AbortController();
        this.signal = this.controller.signal;
        this.player.on('play', () => {
            this.player.$container.querySelector('.easyplayer-controls-code-wrap').style.display = 'none'
            this.onPlay()
        })
        this.player.on('pause', () => {
            this.player.$container.querySelector('.easyplayer-controls-code-wrap').style.display = 'none'
            this.onPause()
        })
        this.player.on('videoInfo', (videoInfo: VideoInfoType) => this.onVideoInfo(videoInfo))
        this.player.on('audioInfo', (audioInfo: AudioInfoType) => this.onAudioInfo(audioInfo))
        this.player.on('fullscreen', (isFullscreen: boolean) => this.onFullscreen(isFullscreen))
        this.player.on('mute', (isMute: boolean) => this.onMute(isMute))
        this.player.on('kBps', (KBps: number) => this.onKBps(KBps))
        this.player.on('stretch', (isStretch: boolean) => this.onStretch(isStretch))
        this.player.on('ptz', (ptz: any) => this.onPTZ(ptz))
        this.player.on('screenshots', () => this.onScreenshots())
        this.player.on('contextmenuClose', () => this.onContextmenuClose())
        this.player.on('decodeHevc', () => this.onDecodeHevc())
        this.player.on('liveEnd', () => this.onLiveEnd())
        this.player.on('timeout', () => this.onTimeout())
        this.player.on('recordEnd', () => this.onRecordEnd())
        this.player.on('recordStart', () => this.onRecordStart())
        this.player.on('qualityChange', (quality: string) => this.onQualityChange(quality))
        this.player.on('playbackSeek', () => this.onPlaybackSeek())
        this.player.on('playbackRate', () => this.onPlaybackRate())
        this.player.on('timestamps', () => this.onTimestamps())
        this.player.on('error', (err: any) => this.onError(err))
    }

    /**
     * 播放
     * @param url 播放地址
     */
    play(url: string): Promise<void> {
        this._url = url
        return new Promise((resolve, reject) => {
            try {
                if (this.player) {
                    if (this._isRtcSRS()) {
                        this.player.$container.querySelector('.easyplayer-loading').style.display = 'flex'
                        this.player.player._opt.url = url
                        if (this.videoElement) {
                            this.videoElement.autoplay = true
                            this.videoElement.controls = false
                            this.videoElement.muted = true
                            this.player.player._opt.isWebrtcForSRS = true
                            this.player.player._opt.isWebrtc = true
                            this.player.player._opt.rtcSdp = true
                            //@ts-ignore
                            const sdk = new SrsRtcWhipWhepAsync();
                            sdk.play(url, {
                                videoOnly: true,
                                audioOnly: false
                            }).then(() => {
                                setTimeout(() => {
                                    this.videoElement.srcObject = sdk.stream;
                                    this.player.player.playing = true
                                    this.bindWebRTCDomEvent()
                                    resolve()
                                }, 1000)
                            }).catch((err: any) => {
                                sdk.close();
                                reject(err);
                            })
                        }
                    } else {
                        this.player.play(url).then(() => {
                            setTimeout(() => {
                                resolve()
                            }, 300)
                        }).catch(reject)
                    }
                } else {
                    reject('player is null')
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    private _play() {
        this.player.$container.querySelector('.easyplayer-loading').style.display = 'flex'
        setTimeout(() => {
            this.videoElement.play()
            this.player.player.playing = true
            this._hideNode()
            this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-play').style.display = 'none'
            this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-pause').style.display = 'flex'
        }, 500)
    }

    private _pause() {
        this.videoElement.pause()
        this.player.player.playing = false
        this._hideNode()
        this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-play').style.display = 'flex'
        this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-pause').style.display = 'none'
    }

    private _hideNode() {
        // hide
        this.player.$container.querySelector('.easyplayer-play').style.display = 'none'
        this.player.$container.querySelector('.easyplayer-controls-code-wrap').style.display = 'none'
        this.player.$container.querySelector('.easyplayer-record-stop').style.display = 'none'
        this.player.$container.querySelector('.easyplayer-zoom-stop').style.display = 'none'
        if (this.player.$container.querySelector('.easyplayer-fullscreen').style.display === 'flex') {
            this.player.$container.querySelector('.easyplayer-fullscreen-exit').style.display = 'none'
        }
    }

    private _playerContainerMouseEnter() {
        this.player.$container.querySelector('.easyplayer-controls').style.opacity = 1
    }

    private _playerContainerMouseLeave() {
        this.player.$container.querySelector('.easyplayer-controls').style.opacity = 0
    }

    private bindWebRTCDomEvent() {
        this.player.$container.addEventListener('mouseenter', () => this._playerContainerMouseEnter.call(this), {signal: this.signal})
        this.player.$container.addEventListener('mouseleave', () => this._playerContainerMouseLeave.call(this), {signal: this.signal})
        this.player.$container.querySelectorAll('.easyplayer-controls-item').forEach((target: HTMLElement) => {
            if (target.classList.contains('easyplayer-play') || target.classList.contains('easyplayer-pause')) {
                target.replaceWith(target.cloneNode(true));
            }
            target.style.display = 'flex'
        })
        this._hideNode()
        // play & pause
        this.player.$container.querySelector('.easyplayer-play').addEventListener('click', () => this._play.call(this), {signal: this.signal})
        this.player.$container.querySelector('.easyplayer-pause').addEventListener('click', () => this._pause.call(this), {signal: this.signal})
        this.player.$container.querySelector('.easyplayer-play-big').addEventListener('click', () => this._play.call(this), {signal: this.signal})
    }

    /**
     * 暂停播放
     */
    pause() {
        if (this.player) {
            if (this._isRtcSRS()) {
                this.videoElement.pause()
                this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-play').style.display = 'flex'
                this.player.$container.querySelector('.easyplayer-controls-item.easyplayer-pause').style.display = 'none'
            } else {
                this.player.pause()
            }
        }
    }

    /**
     * 返回是否暂停中状态
     */
    isPause(): boolean | null {
        if (this.player) {
            if (this._isRtcSRS()) {
                return this.videoElement.paused
            } else {
                return this.player.isPause()
            }
        } else {
            return null
        }
    }

    /**
     * 音频切换
     * @param isMute
     */
    setMute(isMute: boolean) {
        if (this.player) {
            if (this._isRtcSRS()) {
                this.videoElement.muted = isMute
                this.player.$container.querySelector('.easyplayer-icon-audio').style.display = isMute ? 'none' : 'flex'
                this.player.$container.querySelector('.easyplayer-icon-mute').style.display = isMute ? 'flex' : 'none'
            } else {
                this.player.setMute(isMute)
            }
        }
    }

    /**
     * 是否静音
     */
    isMute(): boolean | null {
        if (this.player) {
            if (this._isRtcSRS()) {
                return this.videoElement.muted
            } else {
                return this.player.isMute()
            }
        } else {
            return null
        }
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
     *  设置分辨率列表
     * @param qualityList
     * @param quality
     */
    setQualityList(qualityList: string[],quality?:string) {
        const _quality = quality||qualityList[0]
        const easyPlayerQualityMenu  = this.player.$container.querySelector('.easyplayer-quality-menu')
        if(easyPlayerQualityMenu){
            const easyPlayerQualityIconText = easyPlayerQualityMenu.querySelector('.easyplayer-quality-icon-text')
            const easyPlayerQualityMenuList = easyPlayerQualityMenu.querySelector('.easyplayer-quality-menu-list')
            if(qualityList.length>0){
                if(easyPlayerQualityIconText){
                    easyPlayerQualityIconText.innerText=_quality
                    this.setQuality(_quality)
                }
                if(easyPlayerQualityMenuList){
                    easyPlayerQualityMenuList.innerHTML=''
                    easyPlayerQualityMenuList.append(...qualityList.map(c=>{
                        const item = document.createElement('div')
                        item.innerText=c
                        item.setAttribute('data-quality', c);
                        item.classList.add('easyplayer-quality-menu-item')
                        if(c===_quality){
                            item.classList.add('easyplayer-quality-menu-item-active')
                        }
                        item.addEventListener('click', (event:MouseEvent)=>{
                            easyPlayerQualityMenuList.querySelectorAll('.easyplayer-quality-menu-item').forEach((c:Element)=>{
                                c.classList.remove('easyplayer-quality-menu-item-active')
                            })
                            //@ts-ignore
                            event.currentTarget && event.currentTarget.classList.add('easyplayer-quality-menu-item-active')
                        })
                        return item
                    }))
                }
            }
        }
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
    getVideoInfo(): VideoInfoType | null {
        if (!this.player)
            return null
        return this.player.getVideoInfo()
    }

    /**
     * 获取音频信息
     */
    getAudioInfo(): AudioInfoType | null {
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
     * 判断是否为SRS直播源
     */
    private _isRtcSRS() {
        return this.config.isRtcSRS || (this._url.indexOf('/rtc/v1/whep') > -1)
    }

    /**
     * 关闭视频，释放底层资源
     */
    destroy() {
        try{
            if (this.player) {
                if (this._isRtcSRS()) {
                    this.controller.abort()
                }
                this.player.destroy().catch(()=>{})
            }
            this.player = null
            this.container.innerHTML = ''
            this.container.removeAttribute('data--easy-prov')
            this.isDestroy = true
        }catch (error) {}
    }
    close(){
        this.destroy()
        //@ts-ignore
        this.player = new window.EasyPlayerPro(this.container, this.config);
    }
}

export interface EasyPlayerProType{
    isDestroy:boolean,
    onPlay:() => void,
    onPause:() => void,
    onVideoInfo:(videoInfo: VideoInfoType)=>void,
    onAudioInfo:(audioInfo: AudioInfoType)=>void,
    onFullscreen:(isFullscreen: boolean)=>void,
    onMute:(isMute: boolean)=>void,
    onKBps:(KBps: number)=>void,
    onStretch:(isStretch: boolean)=>void,
    onPTZ:(ptz: any)=>void,
    onScreenshots:()=>void,
    onContextmenuClose:()=>void,
    onDecodeHevc:()=>void,
    onLiveEnd:()=>void,
    onTimeout:()=>void,
    onRecordEnd:()=>void,
    onRecordStart:()=>void,
    onQualityChange:(quality: string)=>void,
    onPlaybackSeek:()=>void,
    onPlaybackRate:()=>void,
    onTimestamps:()=>void,
    onError:(err: any)=>void,
    play:(url: string)=>Promise<void>,
    pause:()=>void,
    isPause:()=>boolean,
    setMute:(isMute: boolean)=>void,
    isMute:()=>boolean|null,
    screenshot:(name?: string, type?: string, rato?: number, format?: string)=>string | Blob | null,
    setFullscreen:(isFullscreen: boolean)=>void,
    exitFullscreen:()=>void,
    setQuality:(quality: string)=>void,
    setQualityList:(qualityList: string[],quality?:string)=>void,
    setRate:(rate: number)=>void,
    seekTime:(time: number)=>void,
    getVideoInfo:()=>VideoInfoType | null,
    getAudioInfo:()=>AudioInfoType | null,
    setMic:(isMic: boolean)=>void,
    destroy:()=>void,
    close:()=>void,
}
