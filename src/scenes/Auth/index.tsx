import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router'
import './index.scss'
import Page from '#/components/Page'
import SignIn from './components/SignIn'

interface AuthSceneProps extends RouteComponentProps {}

const AuthScene = (props: AuthSceneProps) => {
  const { match } = props

  return (
    <div className="auth">
      <div className="auth__inner">
        <Switch>
          <Route
            path={`${match.url}`}
            exact={true}
            render={props => (
              <Page title="Auth">
                <SignIn {...props} />
              </Page>
            )}
          ></Route>
        </Switch>
      </div>
    </div>
  )
}

export default AuthScene
