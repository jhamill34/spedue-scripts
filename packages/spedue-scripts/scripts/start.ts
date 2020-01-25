import chalk from 'chalk'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { config } from '../config/webpack.config'

process.on('unhandledRejection', err => {
  throw err
})

function start(): void {
  const compiler = webpack(config)
  const devServer = new WebpackDevServer(compiler, {
    historyApiFallback: true,
    open: true,
  })

  devServer.listen(9000, '0.0.0.0', err => {
    if (err) {
      return console.log(chalk.red(err))
    }

    console.log(chalk.cyan(`Starting the development server...`))
  })

  function handleTerminate(): void {
    console.log(
      chalk.cyan(`🛑 Stopping the dev server and cleaning up after myself 🧹`)
    )
    devServer.close()
    process.exit(0)
  }

  process.on('SIGTERM', handleTerminate)
  process.on('SIGINT', handleTerminate)
}

function main(): void {
  try {
    console.log(chalk.cyan(`📦 Packing up your code and spinning up a server.`))
    start()
  } catch (e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

main()
