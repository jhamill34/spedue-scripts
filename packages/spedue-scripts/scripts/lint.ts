import chalk from 'chalk'
import { CLIEngine } from 'eslint'
import { parseOptions, Options } from '@spedue/utils'
import { paths } from '../config/paths'

process.on('unhandledRejection', err => {
  throw err
})

async function lint(argv: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    const linter = new CLIEngine({
      cwd: paths.appRoot,
      fix: true,
    })

    let report
    if (argv.positional.length > 0) {
      report = linter.executeOnFiles(argv.positional)
    } else {
      report = linter.executeOnFiles(['*/**/*.{js,ts,tsx}'])
    }

    const formatter = linter.getFormatter()
    CLIEngine.outputFixes(report)

    const {
      errorCount,
      warningCount,
      fixableErrorCount,
      fixableWarningCount,
    } = report
    const unfixableErrors = errorCount - fixableErrorCount
    const unfixableWarnings = warningCount - fixableWarningCount

    if (unfixableErrors > 0 || unfixableWarnings > 0) {
      reject(new Error(formatter(report.results)))
    } else {
      resolve()
    }
  })
}

async function main(): Promise<void> {
  const argv = parseOptions(process.argv.slice(2))

  console.log(chalk.cyan(`🔍 Making sure things are looking clean.`))
  try {
    await lint(argv)
    console.log(chalk.green(`🎊 Everything looks in tip top shape! 👍`))
  } catch (e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

main()
