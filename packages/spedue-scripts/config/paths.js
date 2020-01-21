const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const appDir = fs.realpathSync(process.cwd())

function resolveApp(relativePath) {
  return path.resolve(appDir, relativePath)
}

module.exports = {
  appRoot: resolveApp('.'),
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appTsConfig: ts.findConfigFile(appDir, ts.sys.fileExists, 'tsconfig.json'),
  appTsDist: resolveApp('dist'),
  appSrc: resolveApp('src')
}
