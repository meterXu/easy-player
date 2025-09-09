import { defineConfig } from 'vite'
//@ts-ignore
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      outDir: 'dist/types',
    }),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: { // 配置为库模式
      entry: 'src/index.ts',
      name: 'VueEasyPlayerPro',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
