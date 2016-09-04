const WebpackConf = require('./webpack.client.config.js');
// TODO
module.exports = (config) => {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'web-client/**/*test.js',
    ],

    exclude: [],

    preprocessors: {
      'web-client/**/*test.js': ['babel', 'webpack', 'sourcemap'],
    },

    webpack: WebpackConf,
    webpackServer: {
      noInfo: true,
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline',
      },
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],

    singleRun: true,

    concurrency: Infinity,
  });
};
