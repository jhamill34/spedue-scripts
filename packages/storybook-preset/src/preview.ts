import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'

type StorybookDocsParameters = {
  container: Function
  page: Function
}

export function setupPreview(
  addParameters: (options: { docs: StorybookDocsParameters }) => void
): void {
  addParameters({
    docs: {
      container: DocsContainer,
      page: DocsPage,
    },
  })
}
