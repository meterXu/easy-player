import {EasyPlayerConfig, defaultConfig} from "./config";
import {merge} from 'lodash-es'

export class easyPlayer {
    private readonly player: any = null;
    private config: EasyPlayerConfig = {};

    constructor(container: HTMLElement, config: EasyPlayerConfig) {
        this.config = merge({}, defaultConfig, config)
        this.player = new window.EasyPlayerPro(container, config);
    }

    play(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.player) {
                this.player.play(url).then(resolve).catch(reject)
            } else {
                reject('player not found!');
            }
        })
    }

    setMute(isMute: boolean) {
        if (!this.player)
            return
        this.player.setMute(isMute)
    }
}
