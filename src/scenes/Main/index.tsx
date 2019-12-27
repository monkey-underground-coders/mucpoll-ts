import React from 'react'
import { RouteComponentProps, Switch, Route, Redirect, withRouter } from 'react-router'
import Page from '#/components/Page'
import Cabinet from './Cabinet'
import Navbar from '#/components/Navbar'
import { connect } from 'react-redux'
import { StoreRootState } from '#/store/types'
import userSelectors from '#/store/selectors/user'
import './index.scss'

interface MainSceneProps extends RouteComponentProps {
  authenticated: boolean | null
}

const MainScene = (props: MainSceneProps) => {
  const { match } = props

  // Block visiting not authenticated user
  if (!props.authenticated) {
    return <Redirect to="/auth" />
  }

  return (
    <div className="main">
      <div className="main__inner">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="layout">
          <Switch>
            <Route
              path={`${match.url}`}
              exact={true}
              render={props => (
                <Page title="Polling panel">
                  <Cabinet {...props} />
                </Page>
              )}
            />
          </Switch>
        </div>
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
  )(MainScene)
)
