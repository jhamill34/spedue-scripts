import { addParameters } from '@storybook/react'
import { setupPreview } from '@spedue/storybook-preset/dist/preview'
import { create } from '@storybook/theming'

const myTheme = create({
  base: 'light',

  colorPrimary: 'hotpink',
  colorSecondary: 'hotpink',

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Toolbar default and active colors
  barTextColor: 'black',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  brandTitle: 'My custom storybook',
  brandImage: 'https://placehold.it/350x150',
})

setupPreview(addParameters)

addParameters({
  options: {
    theme: myTheme,
  },
})
