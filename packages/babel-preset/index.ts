import { TransformOptions } from '@babel/core'

function configure(): TransformOptions {
  return {
    presets: ['@babel/env', '@babel/react', '@babel/typescript'],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
    ],
  }
}

export default configure
