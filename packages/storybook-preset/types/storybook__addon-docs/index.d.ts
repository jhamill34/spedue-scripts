declare module '@storybook/addon-docs/mdx-compiler-plugin' {
  function createCompiler(mdxOptions?: any): (options: any) => void

  export = createCompiler
}

declare module '@storybook/addon-docs/blocks' {
  export declare const DocsPage: Function
  export declare const DocsContainer: Function
}
