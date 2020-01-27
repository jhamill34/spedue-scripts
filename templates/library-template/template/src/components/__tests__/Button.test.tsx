import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Button } from '../Button'

describe('<Button />', () => {
  it('should render text', () => {
    const { container } = render(<Button title="Click Me!" />)

    expect(container).toHaveTextContent('Click Me!')
  })
})
