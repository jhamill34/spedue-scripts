'use strict'

const chalk = require('chalk')
const CLIEngine = require('eslint').CLIEngine
const paths = require('../config/paths')

process.on('unhandledRejection', err => {
  throw err
})

const argv = {
  lintFiles: process.argv.slice(2)
}

async function main() {
  console.log(chalk.cyan(`🔍 Making sure things are looking clean.`))
  try {
    await lint()
    console.log(chalk.green(`🎊 Everything looks in tip top shape! 👍`))
  } catch (e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

function lint() {
  return new Promise((resolve, reject) => {
    const linter = new CLIEngine({ 
      cwd: paths.appRoot,
      fix: true,
    })
  
    let report
    if (argv.lintFiles.length > 0) {
      report = linter.executeOnFiles(argv.lintFiles)
    } else {
      report = linter.executeOnFiles("*/**/*.{js,ts,tsx}")
    }

    const formatter = linter.getFormatter()
    CLIEngine.outputFixes(report)

    const { errorCount, warningCount, fixableErrorCount, fixableWarningCount } = report
    const unfixableErrors = errorCount - fixableErrorCount
    const unfixableWarnings = warningCount - fixableWarningCount

    if (unfixableErrors > 0 || unfixableWarnings > 0) {
      reject(new Error(formatter(report.results)))
    } else {
      resolve()
    }
  })
}

main() 
