import React from 'react'
import { RouteComponentProps } from 'react-router'

interface GuestSceneProps extends RouteComponentProps {}

const GuestScene = (props: GuestSceneProps) => {
  const { match } = props

  return (
    <div className="guest">
      <div className="guest__inner">Welcome, Guest!</div>
    </div>
  )
}

export default GuestScene
