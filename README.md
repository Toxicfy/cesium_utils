## cesium_utils

some utils of build cesium program 🧰

### dependencies && devDependencies

> Webpack + Cesium + Typescript

1. <u>cesium-1.93 version</u>
   - dependencies node_modules
   - assetsDir lib
   - webpack alias cesium: path.resolve(\_\_dirname, 'node_modules/cesium')
   
2. <u>webpack && webpack-cli</u>
   - webpack-config.config.js
   
3. <u>eslint</u>
   - .eslintrc.js (style by eslint-config-standard)
   - .eslintignore
   
4. <u>typescript</u>
   - webpack
     - loader —— ts-loader
     - resolve —— extension add .ts
   - config —— tsconfig.json

