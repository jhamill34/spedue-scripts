import * as path from 'path'
import * as fs from 'fs'
import * as chalk from 'chalk'
import * as glob from 'glob'
import { parseOptions, Options } from '@spedue/utils'
import { paths } from '../config/paths'

import ts = require('typescript')

process.on('unhandledRejection', err => {
  throw err
})

function expandRoot(rootFile: string): string[] {
  const result: string[] = []
  const resolvedFile = path.resolve(paths.appRoot, rootFile)

  if (fs.existsSync(resolvedFile)) {
    const stats = fs.lstatSync(resolvedFile)

    if (stats.isDirectory()) {
      console.log(
        chalk.cyan(
          `     found a directory. Grabbing all top level files in directory:`
        )
      )
      const allFiles = glob
        .sync(path.resolve(resolvedFile, '*'))
        .filter(f => fs.lstatSync(f).isFile())
      return allFiles
    } else if (stats.isFile()) {
      console.log(chalk.cyan(`     using ${rootFile} as root.`))
      return [resolvedFile]
    }
  } else if (glob.hasMagic(resolvedFile)) {
    console.log(
      chalk.cyan(
        `     found glob pattern, expanding glob and using all found files...`
      )
    )
    const allFiles = glob
      .sync(resolvedFile)
      .filter(f => fs.lstatSync(f).isFile())
    return allFiles
  }

  return result
}

async function compile(argv: Options): Promise<ts.EmitResult> {
  return new Promise((resolve, reject) => {
    if (!paths.appTsConfig) {
      return reject(new Error(`   Sorry I couldn't find a tsconfig.json file`))
    }

    const configFile = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile)
    const options = Object.assign(
      {
        outDir: paths.appTsDist,
        noEmit: argv.keys.noEmit ? true : false,
      },
      configFile.config.compilerOptions
    )

    let rootFiles = []
    if (argv.positional[0]) {
      rootFiles = expandRoot(argv.positional[0])
    } else {
      rootFiles = expandRoot('index.ts')
    }

    if (rootFiles.length === 0) {
      return reject(
        new Error(
          `   🤷‍♂️ Sorry I couldn't find any files that matched your specified pattern`
        )
      )
    }

    const program = ts.createProgram(rootFiles, options)
    const status = program.emit()

    const allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(status.diagnostics)

    if (allDiagnostics.length > 0) {
      const errMessage = allDiagnostics.map(d => {
        if (d.file && d.start) {
          const { line, character } = d.file.getLineAndCharacterOfPosition(
            d.start
          )
          const message = ts.flattenDiagnosticMessageText(d.messageText, '\n')

          const fileNameFormat = chalk.whiteBright.bold.underline(
            d.file.fileName
          )
          const locationFormat = chalk.gray(`${line + 1}:${character + 1}`)
          const messageFormat = chalk.red(message)

          return `\n${fileNameFormat}\n  ${locationFormat}    ${messageFormat}\n`
        } else {
          return ts.flattenDiagnosticMessageText(d.messageText, '\n')
        }
      })
      errMessage.push(
        chalk.bold.yellow(
          `  ${errMessage.length} problem${
            errMessage.length !== 1 ? 's' : ''
          }\n`
        )
      )

      reject(new Error(errMessage.join('\n')))
    }

    resolve(status)
  })
}

async function main(): Promise<void> {
  const argv = parseOptions(process.argv.slice(2))
  console.log(chalk.cyan(`📦 Getting ready to compile your code`))
  if (!paths.appTsConfig) {
    console.error(
      chalk.red(
        `Sorry I couldn't find a valid tsconfig.json 😕. Did you delete the one I made you?`
      )
    )
    process.exit(1)
  }

  try {
    await compile(argv)
    console.log(chalk.green(`   Your code is compiled and ready to go 😎 🎉`))
  } catch (e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }
}

main()
