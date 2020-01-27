// eslint-disable-next-line tsdoc/syntax
/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'

type ButtonProps = {
  title: string
}

export function Button(props: ButtonProps): React.ReactElement {
  return <button sx={{ color: 'red' }}>{props.title}</button>
}
