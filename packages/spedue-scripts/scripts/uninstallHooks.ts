#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'

function install(): void {
  const cwd = process.env.INIT_CWD || process.cwd()
  const fromLocation = path.join(cwd, '.git')

  if (fs.existsSync(fromLocation)) {
    const hooksToRemove = fs.readdirSync(
      path.join(__dirname, '..', 'git-hooks')
    )
    console.log(chalk.cyan(`Removing the following Git Hooks:`))
    hooksToRemove.forEach(h => {
      console.log(chalk.cyan(`    ${h}`))
      fs.removeSync(path.join(fromLocation, 'hooks', h))
    })
  } else {
    console.log(
      chalk.yellow(
        `Looks like you're not in a git repo so there are not hooks to remove. Skipping.`
      )
    )
  }
}

install()
