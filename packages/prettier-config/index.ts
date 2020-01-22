import { RequiredOptions } from 'prettier'

function configure(): Partial<RequiredOptions> {
  return {
    semi: false,
    trailingComma: 'es5',
    singleQuote: true,
    tabWidth: 2,
  }
}

export default configure()
