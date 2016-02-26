module.exports = {
    entry: './index',
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: 'npm-gui.js',
        library: 'NpmGui',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    }
};