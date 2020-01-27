import path from 'path'
import chalk from 'chalk'
import { run as jestRun } from 'jest-cli'
import fs from 'fs-extra'
import { parseOptions, Options } from '@spedue/utils'
import { paths } from '../config/paths'

process.on('unhandledRejection', err => {
  throw err
})

async function test(argv: Options): Promise<void> {
  const jestArgs = []

  // Determine test setup file locations
  const userTestSetup = fs.existsSync(
    path.join(paths.appRoot, 'src/setupTests.ts')
  )
    ? '<rootDir>/src/setupTests.ts'
    : undefined

  const jestSetup = path.relative(
    paths.appRoot,
    require.resolve('../config/jestSetup')
  )

  const setupFiles = [`<rootDir>/${jestSetup}`]
  if (userTestSetup) {
    setupFiles.push(userTestSetup)
  }

  const packageJson = await import(path.join(paths.appRoot, 'package.json'))

  const config = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
    testPathIgnorePatterns: ['node_modules', '.cache', 'public', '.next'],
    transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
    globals: {
      __PATH_PREFIX__: '',
    },
  }

  if (packageJson.jestConfig) {
    Object.assign(config, packageJson.jestConfig)
  }

  Object.assign(config, {
    rootDir: paths.appRoot,
    setupFiles,
  })

  jestArgs.push('--config', JSON.stringify(config))

  if (!argv.keys.noWatch) {
    jestArgs.push('--watch')
  }

  jestRun(jestArgs)
}

function main(): void {
  const argv = parseOptions(process.argv.slice(2))

  console.log(chalk.cyan(`🔧 Getting ready to test your code 👷‍♂️`))
  test(argv)
}

main()
