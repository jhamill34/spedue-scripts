declare module '@commitlint/load' {
  type RuleLevel = 0 | 1 | 2
  type RuleCondition = 'always' | 'never'
  type RuleOption = any
  type PrimitiveRule = [RuleLevel, RuleCondition, RuleOption?]
  type FunctionRule = () => PrimitiveRule
  type AsyncFunctionRule = () => Promise<PrimitiveRule>
  type Rule = PrimitiveRule | FunctionRule | AsyncFunctionRule

  type ParserPreset = {
    name: string
    path: string
    opts: any
  }

  type Seed = {
    extends?: string[]
    parserPreset?: string
    rules?: { [ruleName: string]: Rule }
  }

  type Config = {
    extends: string[]
    parserPreset?: ParserPreset
    rules: { [ruleName: string]: Rule }
  }

  type LoadOptions = {
    file?: string
    cwd: string
  }

  function load(seed: Seed = {}, options?: LoadOptions): Promise<Config>

  export = load
}
