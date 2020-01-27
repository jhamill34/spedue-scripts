import path from 'path'
import os from 'os'
import chalk from 'chalk'
import crossSpawn from 'cross-spawn'
import fs from 'fs-extra'
import { parseOptions } from '@spedue/utils'
import { paths } from '../config/paths'

type Template = {
  location: string
  name: string
}

type StringMap = {
  [key: string]: string
}

type Package = {
  name: string
  version: string
  license: string
  main: string
  types: string
  private: boolean
  scripts: StringMap
  prettier: string
  eslintConfig: {
    extends: string
  }
  jestConfig?: {
    testEnvironment: string
    testRegex: string
    testPathIgnorePatterns: string[]
    transformIgnorePatterns: string[]
  }
  dependencies: StringMap
  devDependencies: StringMap
  resolutions?: StringMap
}

async function getTemplateInfo(template: string): Promise<Template> {
  let location: string
  let name: string

  const match = template.match(/^file:(.*)$/)
  if (match) {
    const templatePath = match[1]
    const templateInfo: Package = await import(
      path.join(templatePath, 'package.json')
    )

    name = templateInfo.name
    location = templatePath
  } else {
    name = `@spedue/${template}-template`
    location = name
  }

  return new Promise((resolve, reject) => {
    if (!name) {
      reject(
        new Error(
          `  I couldn't find a valid package.json file in the template provided 🤷‍♂️`
        )
      )
    } else {
      resolve({
        name,
        location,
      })
    }
  })
}

async function main(): Promise<void> {
  const argv = parseOptions(process.argv.slice(2))

  let template = 'react'
  if (typeof argv.keys.template === 'string') {
    template = argv.keys.template
  } else {
    console.log(chalk.cyan('No template provided'))
  }
  console.log(chalk.cyan(`✅ Using ${template} to create a new project`))

  console.log(chalk.cyan(`✅ Fetching the template you requested`))
  let tinfo: Template
  try {
    tinfo = await getTemplateInfo(template)
    crossSpawn.sync('yarn', ['add', tinfo.location, '--cwd', paths.appRoot], {
      cwd: paths.appRoot,
      stdio: 'inherit',
    })
  } catch (e) {
    console.log(chalk.red(e.message))
    process.exit(1)
  }

  console.log(
    chalk.cyan(`✅ Updating the dependencies and scripts from your template`)
  )
  const templatePath = path.join(
    require.resolve(tinfo.name, {
      paths: [paths.appRoot],
    }),
    '..'
  )

  const templateJson: Package = await import(
    path.join(templatePath, 'template.json')
  )

  const packageJson: Package = await import(
    path.join(paths.appRoot, 'package.json')
  )

  const resultJson: Package = {
    name: packageJson.name,
    version: packageJson.version,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    license: 'MIT',
    private: packageJson.private,
    scripts: {
      build: 'spedue pack',
      clean: 'spedue clean',
      compile: "spedue compile 'src/**/*' --noEmit",
      lint: 'spedue lint',
      start: 'spedue start',
      test: 'spedue test',
    },
    prettier: '@spedue/prettier-config',
    eslintConfig: {
      extends: '@spedue/eslint-config',
    },
    dependencies: {},
    devDependencies: {},
  }

  if (templateJson.dependencies) {
    if (packageJson.dependencies) {
      resultJson.dependencies = {
        ...packageJson.dependencies,
        ...templateJson.dependencies,
      }
    } else {
      resultJson.dependencies = templateJson.dependencies
    }
  }

  if (templateJson.devDependencies) {
    if (packageJson.devDependencies) {
      resultJson.devDependencies = {
        ...packageJson.devDependencies,
        ...templateJson.devDependencies,
      }
    } else {
      resultJson.devDependencies = templateJson.devDependencies
    }
  }

  if (templateJson.scripts) {
    resultJson.scripts = {
      ...resultJson.scripts,
      ...templateJson.scripts,
    }
  }

  if (templateJson.jestConfig) {
    resultJson.jestConfig = templateJson.jestConfig
  }

  if (templateJson.resolutions) {
    resultJson.resolutions = templateJson.resolutions
  }

  fs.writeFileSync(
    path.join(paths.appRoot, 'package.json'),
    JSON.stringify(resultJson, null, 2) + os.EOL
  )

  console.log(chalk.cyan(`✅ Copying over base source files from the template`))
  const templateFolder: string = path.join(templatePath, 'template')
  fs.copySync(templateFolder, paths.appRoot)

  console.log(chalk.cyan(`✅ Installing new dependencies`))
  crossSpawn.sync('yarn', ['install', '--cwd', paths.appRoot], {
    cwd: paths.appRoot,
    stdio: 'inherit',
  })

  crossSpawn.sync('yarn', ['remove', tinfo.name, '--cwd', paths.appRoot], {
    cwd: paths.appRoot,
  })

  console.log(chalk.cyan(`✅ Creating a basic gitignore file`))
  if (fs.existsSync(path.join(paths.appRoot, 'gitignore'))) {
    fs.moveSync(
      path.join(paths.appRoot, 'gitignore'),
      path.join(paths.appRoot, '.gitignore'),
      { overwrite: true }
    )
  } else {
    fs.writeFileSync(
      path.join(paths.appRoot, '.gitignore'),
      ['node_modules', 'dist', 'build'].join('\n')
    )
  }

  console.log(chalk.cyan(`✅ Installing git hooks to make your life easier`))
  fs.copySync(
    path.join(__dirname, '..', 'git-hooks'),
    path.join(paths.appRoot, '.git', 'hooks')
  )

  console.log(chalk.cyan(`✅ Initializing a git repository for ya`))
  crossSpawn.sync('git', ['init'], {
    cwd: paths.appRoot,
  })

  // Last step!
  crossSpawn.sync('git', ['add', '.'], {
    cwd: paths.appRoot,
    stdio: 'inherit',
  })

  crossSpawn.sync('git', ['commit', '-m', 'chore: initial commit'], {
    cwd: paths.appRoot,
    stdio: 'inherit',
  })
}

main()
