import React from 'react'
import { RouteComponentProps, Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'
import Page from '#/components/Page'
import Voter from './Voter'

interface GuestSceneProps extends RouteComponentProps {}

const GuestScene = (props: GuestSceneProps) => {
  const { match } = props

  return (
    <div className="guest">
      <div className="guest__inner container">
        <div className="layout container">
          <Switch>
            <Route
              path={`${match.url}/voter/:voteId/:voteUUID`}
              render={props => (
                <Page title="Voting ">
                  <Voter {...props} />
                </Page>
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default GuestScene
