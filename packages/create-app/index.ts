#!/usr/bin/env node

import path from 'path'
import os from 'os'
import fs from 'fs-extra'
import chalk from 'chalk'
import crossSpawn from 'cross-spawn'
import { parseOptions } from '@spedue/utils'

async function main(): Promise<void> {
  const argv = parseOptions(process.argv.slice(2))
  if (argv.positional.length < 1) {
    console.log(
      chalk.red(
        `Whoops! You forgot to tell me where to put the project 😅\n  (e.g. create-spedue-app my-dir)`
      )
    )
    process.exit(1)
  }

  const dirName = argv.positional[0]
  const realDirName = path.join(process.cwd(), dirName)

  console.log(
    chalk.cyan(
      `✅ Setting up the directory for your project in\n    ${realDirName}`
    )
  )
  fs.mkdirpSync(path.join(process.cwd(), dirName))
  process.chdir(realDirName)

  console.log(chalk.cyan(`✅ Creating a Yarn Repo 🧶`))

  const initialPackageJson = {
    name: dirName,
    version: '0.0.0',
    private: true,
    devDependencies: {
      '@spedue/scripts': '*',
    },
  }
  fs.writeFileSync(
    path.join(realDirName, 'package.json'),
    JSON.stringify(initialPackageJson, null, 2) + os.EOL
  )

  console.log(chalk.cyan(`✅ Installing spedue scripts`))
  crossSpawn.sync('yarn', ['install'], {
    cwd: realDirName,
  })

  // Call spedue init --template=${argv.keys.template}
  const args = ['spedue', 'init']
  if (typeof argv.keys.template === 'string') {
    args.push('--template')
    args.push(argv.keys.template)
  }

  args.push('--cwd')
  args.push(realDirName)

  crossSpawn.sync('yarn', args, {
    cwd: realDirName,
    stdio: 'inherit',
  })
}

main()
