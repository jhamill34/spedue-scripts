import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'
import { paths } from './paths'

export const config: Configuration = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: paths.appBuild,
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@spedue/babel-preset'],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
  ],
}
