import chalk from 'chalk'
import { parseOptions, Options } from '@spedue/utils'
import { Project, getCompilerOptionsFromTsConfig, EmitResult } from 'ts-morph'
import glob from 'glob'
import { paths } from '../config/paths'

process.on('unhandledRejection', err => {
  throw err
})

async function compile(argv: Options): Promise<EmitResult> {
  return new Promise((resolve, reject) => {
    if (!paths.appTsConfig) {
      return reject(new Error(`   Sorry I couldn't find a tsconfig.json file`))
    }

    const configFile = getCompilerOptionsFromTsConfig(paths.appTsConfig)
    const compilerOptions = Object.assign(
      { outDir: paths.appTsDist },
      configFile.options
    )

    const program = new Project({ compilerOptions })

    if (argv.positional[0]) {
      console.log(chalk.cyan(`Adding files from ${argv.positional[0]}`))
      const filesToCompile = glob
        .sync(argv.positional[0])
        .filter(f => f.match(/\.tsx?$/))

      console.log(filesToCompile)
      program.addSourceFilesAtPaths(filesToCompile)
    } else {
      console.log(
        chalk.cyan(
          `No source files provided, attempting to use default index.ts`
        )
      )
      program.addSourceFileAtPath('index.ts')
    }

    const diagnostics = program.getPreEmitDiagnostics()
    if (diagnostics.length > 0) {
      return reject(
        new Error(program.formatDiagnosticsWithColorAndContext(diagnostics))
      )
    }

    if (argv.keys.noEmit) {
      resolve(program.emitToMemory())
    } else {
      resolve(program.emit())
    }
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
