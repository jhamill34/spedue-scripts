// Creates a new repo based on the template flag

// Things that need to happen
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