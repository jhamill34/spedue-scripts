/**
 * TODO: Update custom types for commit lint.
 *
 * Curently custom types were needed to use some basic
 * type checking in this library. Thank God they're
 * documentation is basically a TS definition file 😅
 *
 * They're currently working on it:
 * https://github.com/conventional-changelog/commitlint/issues/659
 */
import chalk from 'chalk'
import load from '@commitlint/load'
import lint from '@commitlint/lint'
import { parseOptions } from '@spedue/utils'

async function commitLint(): Promise<void> {
  const argv = parseOptions(process.argv.slice(2))

  const config = await load(
    {
      extends: ['@commitlint/config-conventional'],
    },
    {
      cwd: process.cwd(),
    }
  )

  const report = await lint(
    argv.positional[0],
    config.rules,
    config.parserPreset ? { parserOpts: config.parserPreset.opts } : {}
  )

  if (!report.valid) {
    console.log(
      chalk.white.bold(
        `📬 Looks like you need to format your commit message a little better`
      )
    )
    report.errors.forEach(err => {
      console.log(chalk.red(`❌   ${err.message} (${err.name})`))
    })

    report.warnings.forEach(warn => {
      console.log(chalk.yellow(`⚠️   ${warn.message} (${warn.name})`))
    })

    process.exit(1)
  }
}

commitLint()
