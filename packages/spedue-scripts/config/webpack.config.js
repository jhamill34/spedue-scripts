const HtmlWebpackPlugin = require('html-webpack-plugin')
const paths = require('./paths')

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: paths.appBuild,
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['spedue']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    })
  ]
}