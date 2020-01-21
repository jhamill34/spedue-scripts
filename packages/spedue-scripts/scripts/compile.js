'use strict'

const chalk = require('chalk')
const ts = require('typescript')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const paths = require('../config/paths')

process.on('unhandledRejection', err => {
  throw err
})

const argv = parseOptions(process.argv.slice(2))

async function main() {
  console.log(chalk.cyan(`📦 Getting ready to compile your code`))
  if (!paths.appTsConfig) {
    console.error(chalk.red(`Sorry I couldn't find a valid tsconfig.json 😕. Did you delete the one I made you?`))
    process.exit(1)
  } 

  try {
    await compile()
    console.log(chalk.green(`   Your code is compiled and ready to go 😎 🎉`))
  } catch(e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

function compile() {
  return new Promise((resolve, reject) => {
    const configFile = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile)
    const options = Object.assign({
      outDir: paths.appTsDist,
      noEmit: argv.noEmit ? true : false
    }, configFile.config.compilerOptions)

    let rootFiles = []
    if (argv.rootFile) {
      rootFiles = expandRoot(argv.rootFile)
    } else {
      rootFiles = expandRoot('index.ts')
    }

    if(rootFiles.length === 0) {
      return reject(new Error(`   🤷‍♂️ Sorry I couldn't find any files that matched your specified pattern`))
    }     

    const program = ts.createProgram(rootFiles, options)
    const status = program.emit()

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(status.diagnostics)

    if (allDiagnostics.length > 0) {
      const errMessage = allDiagnostics.map(d => {
        if (d.file) {
          let { line, character } = d.file.getLineAndCharacterOfPosition(d.start)
          let message = ts.flattenDiagnosticMessageText(d.messageText, '\n')

          const fileNameFormat = chalk.whiteBright.bold.underline(d.file.fileName)
          const locationFormat = chalk.gray(`${line + 1}:${character + 1}`)
          const messageFormat = chalk.red(message)

          return `\n${fileNameFormat}\n  ${locationFormat}    ${messageFormat}\n`
        } else {
          return ts.flattenDiagnosticMessageText(d.messageText, '\n')
        }
      })
      errMessage.push(chalk.bold.yellow(`  ${errMessage.length} problem${errMessage.length !== 1 ? 's' : ''}\n`)) 

      reject(new Error(errMessage.join('\n')))
    }

    resolve(status)
  })
}

function expandRoot(rootFile) {
  const result = []
  const resolvedFile = path.resolve(paths.appRoot, rootFile)

  if (fs.existsSync(resolvedFile)) {
    const stats = fs.lstatSync(resolvedFile)

    if (stats.isDirectory()) {
      console.log(chalk.cyan(`     found a directory. Grabbing all top level files in directory:`))
      const allFiles = glob.sync(path.resolve(resolvedFile, '*')).filter(f => fs.lstatSync(f).isFile())
      // allFiles.forEach(f => console.log(chalk.cyan(`     - ${f.replace(paths.appRoot, '.')}`)))
      return allFiles
    } else if (stats.isFile()) {
      console.log(chalk.cyan(`     using ${rootFile} as root.`))
      return [resolvedFile]
    }
  } else if(glob.hasMagic(resolvedFile)) {
    console.log(chalk.cyan(`     found glob pattern, expanding glob and using all found files...`))
    const allFiles = glob.sync(resolvedFile).filter(f => fs.lstatSync(f).isFile())
    // allFiles.forEach(f => console.log(chalk.cyan(`     - ${f.replace(paths.appRoot, '.')}`)))
    return allFiles 
  } 

  return result
}

function parseOptions(args) {
  const options = {}
  const noEmitIndex = args.indexOf('--noEmit')
  options.noEmit = false
  if (noEmitIndex > -1) {
    options.noEmit = true
    args.splice(noEmitIndex, 1)
  }

  options.rootFile = args[0]

  return options
}

main()
