import fs from 'fs-extra';
import path from 'path';
import serveStatic from 'serve-static';
import { type HtmlTagDescriptor, normalizePath, type Plugin, type UserConfig } from 'vite';

interface VitePluginEasyPlayerProOptions {
    easyPlayerBuildRootPath?: string;
    easyPlayerBuildDir?:string
}

export default function vitePluginEasyPlayerPro(options: VitePluginEasyPlayerProOptions = {}): Plugin {
    const {
        easyPlayerBuildRootPath = 'node_modules/easy-player-pro/lib',
        easyPlayerBuildDir = 'build'
    } = options;

    let EASY_PLAYER_PATH = 'assets/easy-player-pro/';
    let EASY_PLAYER_URL = EASY_PLAYER_PATH
    let outDir = 'dist';
    let base: string = '/';
    let isBuild: boolean = false;

    return {
        name: 'vite-plugin-easy-player-pro',
        apply:()=>true,
        config(c, { command }) {
            isBuild = command === 'build';
            if (c.base !== undefined) {
                base = c.base;
                if (base === '') base = './';
            }
            if (c.build?.outDir) {
                outDir = c.build.outDir;
            }
            EASY_PLAYER_URL = path.posix.join(base, EASY_PLAYER_PATH)
            const userConfig: UserConfig = {};
            if(!isBuild){
                // -----------dev-----------
                userConfig.define = {
                    EASY_PLAYER_PATH: JSON.stringify(EASY_PLAYER_PATH),
                    EASY_PLAYER_URL:JSON.stringify(EASY_PLAYER_URL)
                };
            }
            return userConfig;
        },

        configureServer({ middlewares }) {
            const easyPlayerPath = path.join(easyPlayerBuildRootPath,easyPlayerBuildDir);
            middlewares.use(path.posix.join('/',base, EASY_PLAYER_PATH), serveStatic(easyPlayerPath, {
                setHeaders: (res, path, stat) => {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                }
            }));
        },

        async closeBundle() {
            if (isBuild) {
                try {
                    await fs.copy(path.join(easyPlayerBuildRootPath, easyPlayerBuildDir), path.join(outDir, EASY_PLAYER_PATH));
                } catch (err) {
                    console.error('copy failed', err);
                }
            }
        },

        transformIndexHtml() {
            const tags: HtmlTagDescriptor[] = []
            tags.push({
                tag: 'script',
                attrs: {
                    src: isBuild?normalizePath(path.join(EASY_PLAYER_URL, 'EasyPlayer-pro.js')):
                        normalizePath(path.join(easyPlayerBuildRootPath,easyPlayerBuildDir,'EasyPlayer-pro.js')),
                }
            });
            return tags;
        }
    };
}