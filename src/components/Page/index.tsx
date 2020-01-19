import React from 'react'

export interface PageProps {
  title: string
  children: JSX.Element
}

const Page = (props: PageProps) => {
  React.useEffect(() => {
    document.title = props.title
    return () => {}
  }, [props.title])
  return props.children
}

export default Page
