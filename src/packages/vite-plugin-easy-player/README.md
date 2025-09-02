# ⚡ vite-plugin-easy-player

[![npm](https://img.shields.io/npm/v/vite-plugin-easy-player.svg)](https://www.npmjs.com/package/vite-plugin-easy-player)
[![npm](https://img.shields.io/npm/dt/vite-plugin-easy-player)](https://www.npmjs.com/package/vite-plugin-easy-player)

Easily set up a [`easy-player`] project in [`Vite`].

[`easy-player`]: https://github.com/meterXu/easy-player
[`vite`]: https://github.com/vitejs/vite

## Install

```bash
npm i easy-player vite-plugin-easy-player vite -D
# yarn add easy-player vite-plugin-easy-player -D
```

## Usage

add this plugin to `vite.config.js`

```js
import { defineConfig } from 'vite';
import easyPlayer from 'vite-plugin-easy-player';
export default defineConfig({
  plugins: [easyPlayer()]
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
- **Default :** `node_modules/easy-player/lib`

EasyPlayer.js default root path

```js
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [
    cesium({
        easyPlayerBuildRootPath: 'src/libs/EasyPlayer'
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
import cesium from 'vite-plugin-cesium';
export default defineConfig({
  plugins: [
    cesium({
        easyPlayerBuildRootPath: './'
    })
  ]
});
```

## License

MIT
