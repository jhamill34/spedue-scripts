#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'

function install(): void {
  const cwd = process.env.INIT_CWD || process.cwd()
  const toLocation = path.join(cwd, '.git')
  if (fs.existsSync(toLocation)) {
    const fromLocation = path.join(__dirname, '..', 'git-hooks')
    const hooksToInstall = fs.readdirSync(fromLocation)
    console.log(chalk.cyan(`📦 Installing the following Git Hooks:`))
    hooksToInstall.forEach(h => console.log(`    ${h}`))

    fs.copySync(fromLocation, path.join(toLocation, 'hooks'))
  } else {
    console.log(
      chalk.yellow(
        `Looks like you're not in a git repo.\nI'm going to skip this for now.\nRun:\n    git init\n    yarn spedue installHooks\n\nto try again...`
      )
    )
  }
}

install()
