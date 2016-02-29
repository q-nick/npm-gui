var webpack = require('webpack');

module.exports = {
    entry: {
        vendor: './lib/public/app/vendor.js',
        app: './lib/public/app/npm-gui.js'
    },
    output: {
        filename: './lib/public/npm-gui.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', './lib/public/vendor.js')
    ]
};