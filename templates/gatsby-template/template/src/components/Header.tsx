import React from 'react'

type HeaderProps = {
  title: string
}

export function Header(props: HeaderProps): React.ReactElement {
  return <header>{props.title}</header>
}
