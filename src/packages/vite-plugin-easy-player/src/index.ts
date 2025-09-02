import fs from 'fs-extra';
import path from 'path';
import serveStatic from 'serve-static';
import { type HtmlTagDescriptor, normalizePath, type Plugin, type UserConfig } from 'vite';

interface VitePluginEasyPlayerOptions {
    easyPlayerBuildRootPath?: string;
    easyPlayerBuildDir?:string
}

export default function vitePluginEasyPlayer(options: VitePluginEasyPlayerOptions = {}): Plugin {
    const {
        easyPlayerBuildRootPath = 'node_modules/easy-player/lib',
        easyPlayerBuildDir = 'build'
    } = options;

    let EASY_PLAYER_PATH = 'assets/easy-player/';
    let EASY_PLAYER_URL = EASY_PLAYER_PATH
    let outDir = 'dist';
    let base: string = '/';
    let isBuild: boolean = false;

    return {
        name: 'vite-plugin-easy-player',

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
            // -----------dev-----------
            userConfig.define = {
                EASY_PLAYER_PATH: EASY_PLAYER_PATH,
                EASY_PLAYER_URL:EASY_PLAYER_URL
            };
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
            if (isBuild) {
                tags.push({
                    tag: 'script',
                    attrs: {
                        src: normalizePath(path.join(EASY_PLAYER_URL, 'EasyPlayer-pro.js')),
                    }
                });
            }
            return tags;
        }
    };
}