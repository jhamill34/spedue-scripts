'use strict'

const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config/webpack.config')

process.on('unhandledRejection', err => {
  throw err
})

async function main() {
  console.log(chalk.cyan(`📦 Starting to pack up your code!`))
  await build()
  console.log(chalk.green(`   Your code is packed up and ready to go 😎 🎉`))
}

function build() {
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

main()
