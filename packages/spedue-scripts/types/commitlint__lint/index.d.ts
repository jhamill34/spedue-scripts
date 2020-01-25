declare module '@commitlint/lint' {
  type Problem = {
    level: 0 | 1 | 2
    valid: boolean
    name: string
    message: string
  }

  type ReportResult = {
    valid: boolean
    errors: Problem[]
    warnings: Problem[]
  }

  type Options = {
    parserOpts?: any
  }

  function lint(
    message: string,
    rules: { [ruleName: string]: Rule },
    opts?: Options
  ): Promise<ReportResult>

  export = lint
}
