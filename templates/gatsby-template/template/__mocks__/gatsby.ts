import React from 'react'
const gatsby = jest.requireActual('gatsby')

export = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, ...rest }) => {
    return React.createElement('a', {
      href: to,
      ...rest,
    })
  }),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
