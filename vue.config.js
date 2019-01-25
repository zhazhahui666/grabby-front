const path = require('path') //引入node的path模块

const resolve = dir => path.join(__dirname, dir)

const BASE_URL = process.env.NODE_ENV === 'production' ? '/iview-admin' : '/'

module.exports = {
  lintOnSave: false, //eslint  保存时候校验代码
  publicPath: "/",
 
  publicPath: BASE_URL,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },
  //打包不生成.map文件，可以减少打包体积
  productionSourceMap: false,
  devServer: {
    // host: '127.0.0.1',
    port: 1000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        pathRewrite: {
          '^/api': ''
        },
        ws: true
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  },
}