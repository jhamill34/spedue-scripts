import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { App } from '../App'

describe('<App />', () => {
  it('should render the name', () => {
    const { container } = render(<App title="Hello world" />)
    expect(container).toHaveTextContent('Hello world')
  })
})
