#!/usr/bin/env node

import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs-extra'
import * as chalk from 'chalk'
import * as crossSpawn from 'cross-spawn'
import { parseOptions } from '@spedue/utils'

//***********************************************
//*  Extract into @spedue/ts-guards
//***********************************************

type TypeGuard<T> = (val: unknown) => val is T

function isString(val: unknown): val is string {
  return typeof val === 'string'
}

function hasProperty<PropType extends string, AssertedType = unknown>(
  x: unknown,
  prop: PropType,
  typeguard: TypeGuard<AssertedType>
): x is { [P in PropType]: AssertedType } {
  if (typeof x === 'object' && x !== null && prop in x) {
    return typeguard((x as { [P in PropType]: AssertedType })[prop])
  } else {
    return false
  }
}

//***********************************************
//*  End Extract into @spedue/ts-guards
//***********************************************

type Template = {
  location: string
  name: string
}

type StringMap = {
  [key: string]: string
}

function isStringMap(value: unknown): value is StringMap {
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).every(v => typeof v === 'string')
  } else {
    return false
  }
}

type Package = {
  name: string
  version: string
  private: boolean
  scripts: { [key: string]: string }
  prettier: string
  eslintConfig: {
    extends: string
  }
  dependencies: StringMap
  devDependencies: StringMap
}

async function getTemplateInfo(template: string): Promise<Template> {
  let location: string
  let name: string

  const match = template.match(/^file:(.*)$/)
  if (match) {
    const templatePath = match[1]
    const templateInfo: unknown = await import(
      path.join(templatePath, 'package.json')
    )

    if (hasProperty(templateInfo, 'name', isString)) {
      name = templateInfo.name
    }

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
  if (argv.positional.length < 1) {
    console.log(
      chalk.red(
        `Whoops! You forgot to tell me where to put the project 😅\n  (e.g. create-spedue-app my-dir)`
      )
    )
    process.exit(1)
  }

  const dirName = argv.positional[0]

  let template = 'react'
  if (typeof argv.keys.template === 'string') {
    template = argv.keys.template
  } else {
    console.log(chalk.cyan('No template provided'))
  }

  console.log(chalk.cyan(`✅ Using ${template} to create a new project`))

  console.log(
    chalk.cyan(
      `✅ Setting up the directory for your project in\n    ${path.join(
        process.cwd(),
        dirName
      )}`
    )
  )
  fs.mkdirpSync(dirName)

  console.log(chalk.cyan(`✅ Creating a Yarn Repo 🧶`))
  const initialPackageJson: Package = {
    name: dirName,
    version: '0.0.0',
    private: true,
    prettier: '@spedue/prettier-config',
    eslintConfig: {
      extends: '@spedue/eslint-config',
    },
    scripts: {
      build: 'spedue pack',
      clean: 'spedue clean',
      compile: "spedue compile 'src/**/*' --noEmit",
      lint: 'spedue lint',
      start: 'spedue start',
      test: 'spedue test',
    },
    dependencies: {},
    devDependencies: {},
  }
  fs.writeFileSync(
    path.join(dirName, 'package.json'),
    JSON.stringify(initialPackageJson, null, 2) + os.EOL
  )

  console.log(chalk.cyan(`✅ Fetching the template you requested`))
  let tinfo: Template
  try {
    tinfo = await getTemplateInfo(template)
    crossSpawn.sync('yarn', ['add', tinfo.location, '--cwd', dirName], {
      cwd: dirName,
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
      paths: [dirName],
    }),
    '..'
  )
  const templateJson: unknown = await import(
    path.join(templatePath, 'template.json')
  )
  const packageJson = await import(path.join(dirName, 'package.json'))

  if (
    hasProperty(templateJson, 'dependencies', isStringMap) &&
    hasProperty(packageJson, 'dependencies', isStringMap)
  ) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...templateJson.dependencies,
    }
  } else {
    packageJson.dependencies = templateJson
  }

  if (
    hasProperty(templateJson, 'devDependencies', isStringMap) &&
    hasProperty(packageJson, 'devDependencies', isStringMap)
  ) {
    packageJson.devDependencies = {
      '@spedue/scripts': '*',
      ...packageJson.devDependencies,
      ...templateJson.devDependencies,
    }
  }

  if (
    hasProperty(templateJson, 'scripts', isStringMap) &&
    hasProperty(packageJson, 'scripts', isStringMap)
  ) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...templateJson.scripts,
    }
  }

  fs.writeFileSync(
    path.join(dirName, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )

  console.log(chalk.cyan(`✅ Copying over base source files from the template`))
  const templateFolder: string = path.join(templatePath, 'template')
  fs.copySync(templateFolder, dirName)

  console.log(chalk.cyan(`✅ Installing new dependencies`))
  crossSpawn.sync('yarn', ['install', '--cwd', dirName], {
    cwd: dirName,
    stdio: 'inherit',
  })

  crossSpawn.sync('yarn', ['remove', tinfo.name, '--cwd', dirName], {
    cwd: dirName,
  })

  console.log(chalk.cyan(`✅ Creating a basic gitignore file`))
  fs.writeFileSync(
    path.join(dirName, '.gitignore'),
    ['node_modules', 'dist', 'build'].join('\n')
  )

  console.log(chalk.cyan(`✅ Initializing a git repository for ya`))
  crossSpawn.sync('git', ['init'], {
    cwd: dirName,
  })

  // Last step!
  crossSpawn.sync('git', ['add', '.'], {
    cwd: dirName,
    stdio: 'inherit',
  })

  crossSpawn.sync('git', ['commit', '-m', '"chore: initial commit"'], {
    cwd: dirName,
    stdio: 'inherit',
  })
}

main()
