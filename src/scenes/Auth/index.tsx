import React from 'react'
import { RouteComponentProps, Switch, Route, Redirect, withRouter } from 'react-router'
import Page from '#/components/Page'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import userSelectors from '#/store/selectors/user'
import { connect } from 'react-redux'
import { StoreRootState } from '#/store/types'
import './index.scss'

interface AuthSceneProps extends RouteComponentProps {
  authenticated: boolean | null
}

const AuthScene = (props: AuthSceneProps) => {
  const { match } = props

  // Block authentication if authenticated user attempts
  // to visit authentication page
  if (props.authenticated) {
    return <Redirect to="/cabinet" />
  }

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
          />

          <Route
            path={`${match.url}/signup`}
            render={props => (
              <Page title="Register">
                <SignUp {...props} />
              </Page>
            )}
          />
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    (store: StoreRootState) => ({
      authenticated: userSelectors.isAuthenticated(store, null)
    }),
    {}
  )(AuthScene)
)
