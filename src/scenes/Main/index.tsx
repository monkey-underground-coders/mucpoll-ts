import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router'
import Page from '#/components/Page'
import Cabinet from './Cabinet'

interface MainSceneProps extends RouteComponentProps {}

const MainScene = (props: MainSceneProps) => {
  const { match } = props

  return (
    <div className="main">
      <div className="main__inner">
        <h5>Polling panel</h5>

        <Switch>
          <Route
            path={`${match.url}`}
            exact={true}
            render={props => (
              <Page title="Polling panel">
                <Cabinet {...props} />
              </Page>
            )}
          ></Route>
        </Switch>
      </div>
    </div>
  )
}

export default MainScene
