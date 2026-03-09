import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import easyPlayerPro from './src/packages/vite-plugin-easy-player-pro/src/index'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_base,
    plugins: [
      vue(),
      vueJsx(),
      easyPlayerPro({
        easyPlayerBuildRootPath: 'src/packages/easy-player-pro/src',
        easyPlayerBuildDir: 'build'
      }) as any
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as true
    }
  }
})
