# ⚡ vite-plugin-easy-player-pro

[![npm](https://img.shields.io/npm/v/vite-plugin-easy-player-pro.svg)](https://www.npmjs.com/package/vite-plugin-easy-player-pro)
[![npm](https://img.shields.io/npm/dt/vite-plugin-easy-player-pro)](https://www.npmjs.com/package/vite-plugin-easy-player-pro)

Easily set up a [`easy-player-pro`] project in [`Vite`].

[`easy-player`]: https://github.com/meterXu/easy-player
[`vite`]: https://github.com/vitejs/vite

## Install

```bash
npm i easy-player vite-plugin-easy-player-pro vite -D
# yarn add easy-player vite-plugin-easy-player-pro -D
```

## Usage

add this plugin to `vite.config.js`

```js
import { defineConfig } from 'vite';
import easyPlayerPro from 'vite-plugin-easy-player-pro';
export default defineConfig({
  plugins: [easyPlayerPro()]
});
```

add dev command to `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

run:

`yarn dev`

## Options

**easyPlayerBuildRootPath**

- **Type :** `string`
- **Default :** `node_modules/easy-player-pro/lib`

EasyPlayer.js default root path

```js
import { defineConfig } from 'vite';
import easyPlayerPro from 'vite-plugin-easy-player-pro';
export default defineConfig({
  plugins: [
      easyPlayerPro({
          easyPlayerBuildRootPath: 'src/libs/EasyPlayerPro'
      })
  ]
});
```

easyPlayerBuildDir

- **Type :** `string`
- **Default :** `build`

The default directory name under EasyPlayer.js storage.

```js
import { defineConfig } from 'vite';
import easyPlayerPro from 'vite-plugin-easy-player-pro';
export default defineConfig({
  plugins: [
      easyPlayerPro({
          easyPlayerBuildRootPath: './'
      })
  ]
});
```

## License

MIT
