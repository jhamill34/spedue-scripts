import chalk from 'chalk'
import fs from 'fs-extra'

process.on('unhandledRejection', err => {
  throw err
})

async function main(): Promise<void> {
  console.log(chalk.cyan(`  Gotta go clean up after your mess 🤷‍♂️`))
  const buildFiles = ['build', 'dist', '.next', '.cache', 'public']
  buildFiles.forEach(f => fs.removeSync(f))
  console.log(chalk.green(`  Nice and clean ✨`))
}

main()
