export type Options = {
  positional: string[]
  keys: {
    [key: string]: string | boolean
  }
}

export function parseOptions(args: string[]): Options {
  const result: Options = {
    positional: [],
    keys: {},
  }

  const RE = /--(\w+)=?(\S*)/
  for (let i = 0; i < args.length; i++) {
    const match = args[i].match(RE)
    if (match) {
      const key = match[1]
      if (match[2] !== '') {
        result.keys[key] = match[2]
      } else if (args.length > i + 1 && !args[i + 1].includes('--')) {
        result.keys[key] = args[i + 1]
        i++
      } else {
        result.keys[key] = true
      }
    } else {
      result.positional.push(args[i])
    }
  }

  return result
}
