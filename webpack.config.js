const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    devtool: 'source-map',
    output: {
        filename: 'bundles.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
        ]
    },
    plugins: [
        new webpack.ProgressPlugin({})
    ],
    resolve: {
        extensions: ['.ts'],
        fallback: {
            "path": require.resolve("path-browserify")
        }
    }
}
