import React from 'react'

type HeaderProps = {
  title: string
}

export function Header(props: HeaderProps): React.ReactElement {
  return <div>{props.title}</div>
}
