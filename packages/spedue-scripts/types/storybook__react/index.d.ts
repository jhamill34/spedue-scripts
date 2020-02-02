declare module '@storybook/react/standalone' {
  type StorybookOptions = {
    mode: 'dev' | 'static'
    port?: number
    configDir: string

    docsMode?: boolean

    /** Required only for static mode */
    outputDir?: string
  }

  function storybook(options: StorybookOptions): void

  export = storybook
}
