import path from 'path'
import chalk from 'chalk'
import storybookLauncher from '@storybook/react/standalone'
import { parseOptions } from '@spedue/utils'

import fs from 'fs-extra'
import { paths } from '../config/paths'

function story(): void {
  const argv = parseOptions(process.argv.slice(2))
  const configDir = path.join(paths.appRoot, '.storybook')
  const { mode = 'dev', docs = false } = argv.keys

  if (!fs.existsSync(configDir)) {
    console.log(
      `It looks like you don't have a storybook config directory setup. Let me make one for you in ./.storybook 👍`
    )
    fs.copySync(path.join(__dirname, '..', 'storybook'), configDir)
  }

  if (mode === 'dev' || mode === 'static') {
    storybookLauncher({
      mode,
      configDir,
      docsMode: !!docs,
    })
  } else {
    console.log(
      chalk.red(`😕 the --mode flag can only equal "dev" or "static"`)
    )
  }
}

story()
