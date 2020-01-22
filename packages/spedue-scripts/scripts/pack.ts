import * as chalk from 'chalk'
import * as webpack from 'webpack'
import { config } from '../config/webpack.config'

process.on('unhandledRejection', err => {
  throw err
})

async function build(): Promise<webpack.Stats> {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      }

      resolve(stats)
    })
  })
}

async function main(): Promise<void> {
  console.log(chalk.cyan(`📦 Starting to pack up your code!`))
  await build()
  console.log(chalk.green(`   Your code is packed up and ready to go 😎 🎉`))
}

main()
