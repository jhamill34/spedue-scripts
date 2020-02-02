import { Configuration } from 'webpack'
import createCompiler from '@storybook/addon-docs/mdx-compiler-plugin'

function sharedWebpack(webpackConfig: Configuration): Configuration {
  const { module, resolve } = webpackConfig

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module?.rules || []),
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: ['@spedue/babel-preset'],
              },
            },
            require.resolve('react-docgen-typescript-loader'),
          ],
        },
        {
          test: /\.mdx$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: ['@spedue/babel-preset'],
              },
            },
            {
              loader: require.resolve('@mdx-js/loader'),
              options: {
                compilers: [createCompiler()],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      ...resolve,
      extensions: [...(resolve?.extensions || []), '.ts', '.tsx', '.mdx'],
    },
  }
}

export function webpack(webpackConfig: Configuration): Configuration {
  return sharedWebpack(webpackConfig)
}

export function managerWebpack(webpackConfig: Configuration): Configuration {
  return sharedWebpack(webpackConfig)
}

export function managerEntries(entry: string[]): string[] {
  return [...entry, require.resolve('@storybook/addon-docs/register')]
}
