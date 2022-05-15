const path = require('path')
const webpack = require('webpack')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  watch: true,
  // devtool: 'source-map',
  output: {
    library: 'Map',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'main.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin({})
    // new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts'],
    alias: {
      cesium: path.resolve(__dirname, 'node_modules/cesium')
    },
    fallback: {
      path: require.resolve('path-browserify')
    }
  }
}
