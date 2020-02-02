import React from 'react'

type AppProps = {
  title: string
}

export function App(props: AppProps): React.ReactElement {
  return <div>{props.title}</div>
}
