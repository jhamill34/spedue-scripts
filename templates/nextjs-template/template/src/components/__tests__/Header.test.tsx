import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Header } from '../Header'

describe('<Header />', () => {
  it('should render text', () => {
    const { container } = render(<Header title="I'm a header" />)

    expect(container).toHaveTextContent("I'm a header")
  })
})
