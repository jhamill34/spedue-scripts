'use strict'

const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config/webpack.config')
const WebpackDevServer = require('webpack-dev-server')

process.on('unhandledRejection', err => {
  throw err
})

function main() {
  try {
    console.log(chalk.cyan(`📦 Packing up your code and spinning up a server.`))
    start()
  } catch(e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

function start() {
  const compiler = webpack(config)
  const devServer = new WebpackDevServer(compiler, {
    historyApiFallback: true,
    open: true,
  })

  devServer.listen(9000, '0.0.0.0', (err) => {
    if (err) {
      return console.log(chalk.red(err))
    }

    console.log(chalk.cyan(`Starting the development server...`))
  })

  const signals = ['SIGTERM', 'SIGINT']

  signals.forEach(sig => {
    process.on(sig, () => {
      console.log(chalk.cyan(`🛑 Stopping the dev server and cleaning up after myself 🧹`))
      devServer.close()
      process.exit(0)
    })
  })
}

main()
