#!/usr/bin/env node

import * as crossSpawn from 'cross-spawn'
import * as chalk from 'chalk'

const args = process.argv.slice(2)
const script = args[0]

if (['pack', 'clean', 'compile', 'lint', 'start', 'test'].includes(script)) {
  const result = crossSpawn.sync(
    'node',
    [require.resolve(`../scripts/${script}`), ...args.slice(1)],
    { stdio: 'inherit' }
  )

  if (result.signal && ['SIGKILL', 'SIGTERM'].includes(result.signal)) {
    console.log(
      chalk.yellow(
        `    ⚠️ The build failed because the process exited early ⚠️`
      )
    )

    process.exit(1)
  }

  process.exit(result.status || 0)
} else {
  console.log(chalk.red(`I don't know what the ${script} script does 😞`))
}
