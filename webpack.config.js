const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  watch: true,
  devtool: 'source-map',
  output: {
    library: 'Map',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'main.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin({}),
    new BundleAnalyzerPlugin({})
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
  },
  optimization: {
    splitChunks: {
    }
  }
}
