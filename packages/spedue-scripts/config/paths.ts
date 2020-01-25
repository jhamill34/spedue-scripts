import fs from 'fs'
import path from 'path'
import ts = require('typescript')

const appDir = fs.realpathSync(process.cwd())

function resolveApp(relativePath: string): string {
  return path.resolve(appDir, relativePath)
}

export const paths = {
  appRoot: resolveApp('.'),
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appTsConfig: ts.findConfigFile(appDir, ts.sys.fileExists, 'tsconfig.json'),
  appTsDist: resolveApp('dist'),
  appSrc: resolveApp('src'),
}
