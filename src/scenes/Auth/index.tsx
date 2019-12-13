import React from 'react'
import { RouteComponentProps } from 'react-router'

interface AuthSceneProps extends RouteComponentProps {}

const AuthScene = (props: AuthSceneProps) => {
  const { match } = props

  return (
    <div className="auth">
      <div className="auth__inner">Authorization</div>
    </div>
  )
}

export default AuthScene
