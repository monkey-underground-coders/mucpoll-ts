import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

interface GuestSceneProps extends RouteComponentProps {}

const GuestScene = (props: GuestSceneProps) => {
  const { match } = props

  return (
    <div className="guest">
      <div className="guest__inner container">
        <div>Welcome, Guest!</div>
        <Link className="mt-2" to="/cabinet">
          Click here to visit cabinet
        </Link>
      </div>
    </div>
  )
}

export default GuestScene
