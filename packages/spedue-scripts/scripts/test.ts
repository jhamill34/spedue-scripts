import chalk from 'chalk'
import jest from 'jest'
import { parseOptions, Options } from '@spedue/utils'
import { paths } from '../config/paths'

process.on('unhandledRejection', err => {
  throw err
})

function test(argv: Options): void {
  const jestArgs = []

  const config = {
    rootDir: paths.appRoot,
    preset: 'ts-jest',
  }

  jestArgs.push('--config', JSON.stringify(config))

  if (!argv.keys.noWatch) {
    jestArgs.push('--watch')
  }

  jest.run(jestArgs)
}

function main(): void {
  const argv = parseOptions(process.argv.slice(2))

  console.log(chalk.cyan(`🔧 Getting ready to test your code 👷‍♂️`))
  test(argv)
}

main()
