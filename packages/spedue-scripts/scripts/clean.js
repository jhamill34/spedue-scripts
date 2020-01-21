'use strict'

const chalk = require('chalk')
const rimraf = require('rimraf')

const paths = require('../config/paths')

process.on('unhandledRejection', err => {
  throw err
})

async function main() {
  console.log(chalk.cyan(`  Gotta go clean up after your mess 🤷‍♂️`))
  await clean(paths.appBuild)
  await clean(paths.appTsDist)
  console.log(chalk.green(`  Nice and clean ✨`))
}

function clean(dir) {
  return new Promise((resolve, reject) => {
    rimraf(dir, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

main()
