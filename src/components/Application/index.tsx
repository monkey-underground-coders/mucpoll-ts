import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { history } from '#/store/history'
import store from '#/store'
import GuestScene from '#/scenes/Guest'
import MainScene from '#/scenes/Main'
import AuthScene from '#/scenes/Auth'

interface ApplicationProps {}

const Application = (props: ApplicationProps) => {
  const applicationRoutes = (
    <Switch>
      <Route path="/" component={GuestScene} exact={true} />
      <Route path="/cabinet" component={MainScene} />
      <Route path="/auth" component={AuthScene} />
    </Switch>
  )

  return (
    <Provider store={store}>
      <Router history={history}>{applicationRoutes}</Router>
    </Provider>
  )
}

export default Application
