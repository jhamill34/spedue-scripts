'use strict'

const chalk = require('chalk')
const jest = require('jest')
const paths = require('../config/paths')

process.on('unhandledRejection', err => {
  throw err
})

const argv = {
  watch: !process.argv.slice(2).includes('--noWatch')
}

function main() {
  console.log(chalk.cyan(`🔧 Getting ready to test your code 👷‍♂️`))
  test()
}

function test() {
  const jestArgs = []

  const config = {
    rootDir: paths.appRoot,
    preset: 'ts-jest'
  }

  jestArgs.push(
    '--config',
    JSON.stringify(config)
  )

  if (argv.watch) {
    jestArgs.push('--watch')
  }

  jest.run(jestArgs)
}

main()
