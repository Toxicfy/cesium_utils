const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    output: {
        filename: 'bundles.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/},
        ]
    },
    plugins: [
        new webpack.ProgressPlugin({})
    ],
    resolve: {
        fallback: {
            "path": false
        }
    }
}