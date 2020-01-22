#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { parseOptions } = require('spedue-utils')

function main() {
  const argv = parseOptions(process.argv.slice(2))
  if (argv.positional.length < 1) {
    console.log(chalk.red(`Whoops! You forgot to tell me where to put the project 😅\n  (e.g. create-spedue-app my-dir)`))
    process.exit(1)
  }

  const dirName = argv.positional[0]
  const template = argv.template || 'react'

  // STEP 1: Create the location
  if (fs.existsSync(dirName)) {
    console.log(chalk.red(`It looks like the location you specified already exists 🤔.\nExiting...`))
    process.exit(1)
  }
  
  fs.mkdirSync(dirName)

  
}

main()

// Creates a new repo based on the template flag

// Things that need to happen
// - Create directory <dirName>

// - Generate and update the package.json
// {
//   "name": "<dirName>",
//   "version": "0.0.0",
//   "license": "MIT",
//   "private": true,
//   "scripts": {
//     "build": "spedue pack",
//     "clean": "spedue clean",
//     "compile": "spedue compile 'src/**/*' --noEmit",
//     "lint": "spedue lint",
//     "start": "spedue start",
//     "test": "spedue test"
//   },
//   "prettier": "prettier-config-spedue",
//   "eslintConfig": {
//     "extends": "spedue"
//   }
// }


// - Copy over the template repo and merge deps
// - run git init 
// - run yarn install 
// - copy over the git hooks
// - generate LISENSE file
// - generate README file