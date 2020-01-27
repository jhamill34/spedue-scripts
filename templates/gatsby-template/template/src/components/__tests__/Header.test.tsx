import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Header } from '../Header'

describe('<Header />', () => {
  it('should render the name', () => {
    const { container } = render(<Header title="Hello world" />)
    expect(container).toHaveTextContent('Hello world')
  })
})
