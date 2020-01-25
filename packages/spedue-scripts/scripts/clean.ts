import chalk from 'chalk'
import rimraf from 'rimraf'
import { paths } from '../config/paths'

process.on('unhandledRejection', err => {
  throw err
})

async function clean(dir: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // TODO: change this to use fs-extra
    rimraf(dir, err => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

async function main(): Promise<void> {
  console.log(chalk.cyan(`  Gotta go clean up after your mess 🤷‍♂️`))
  await clean(paths.appBuild)
  await clean(paths.appTsDist)
  console.log(chalk.green(`  Nice and clean ✨`))
}

main()
