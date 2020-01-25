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

type Package = {
  name: string
  version: string
  private: boolean
  scripts: { [key: string]: string }
  prettier: string
  eslintConfig: {
    extends: string
  }
  dependencies: { [key: string]: string }
  devDependencies: { [key: string]: string }
}

async function getTemplateInfo(template: string): Promise<Template> {
  let location: string
  let name: string

  const match = template.match(/^file:(.*)$/)
  if (match) {
    const templatePath = match[1]
    // TODO: should we assert this type?
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

  // TODO: should we assert this type?
  const templateJson: Package = await import(
    path.join(templatePath, 'template.json')
  )

  // TODO: should we assert this type?
  const packageJson: Package = await import(
    path.join(paths.appRoot, 'package.json')
  )

  packageJson.prettier = '@spedue/prettier-config'
  packageJson.eslintConfig = {
    extends: '@spedue/eslint-config',
  }

  packageJson.scripts = {
    build: 'spedue pack',
    clean: 'spedue clean',
    compile: "spedue compile 'src/**/*' --noEmit",
    lint: 'spedue lint',
    start: 'spedue start',
    test: 'spedue test',
  }

  if (templateJson.dependencies) {
    if (packageJson.dependencies) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...templateJson.dependencies,
      }
    } else {
      packageJson.dependencies = templateJson.dependencies
    }
  }

  if (templateJson.devDependencies) {
    if (packageJson.devDependencies) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...templateJson.devDependencies,
      }
    } else {
      packageJson.devDependencies = templateJson.devDependencies
    }
  }

  if (templateJson.scripts) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...templateJson.scripts,
    }
  }

  fs.writeFileSync(
    path.join(paths.appRoot, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
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
  fs.writeFileSync(
    path.join(paths.appRoot, '.gitignore'),
    ['node_modules', 'dist', 'build'].join('\n')
  )

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
