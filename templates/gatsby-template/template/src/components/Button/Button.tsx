import React from 'react'

type ButtonProps = {
  title: string
}

export function Button(props: ButtonProps): React.ReactElement {
  return <button>{props.title}</button>
}
