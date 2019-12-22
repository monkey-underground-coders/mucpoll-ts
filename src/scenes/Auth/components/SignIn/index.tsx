import React, { FormEvent } from 'react'
import './index.scss'
import { Link, withRouter, Redirect } from 'react-router-dom'
import apiRoutes from '#/agent/api'
import { connect } from 'react-redux'
import { StoreRootState } from '#/store/types'
import { authorize } from '#/store/actions/user'
import userSelectors from '#/store/selectors/user'

interface SignInProps {
  authenticated: boolean | null
  authorize: any
}

const SignIn = (props: SignInProps) => {
  const [formState, setFormState] = React.useState({ username: '', password: '' })

  const changeFormState = (formField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [formField]: event.target.value })
  }

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault()
    const { username, password } = formState

    const basicAuthToken = window.btoa(unescape(encodeURIComponent(`${username}:${password}`)))
    const headers = { Authorization: `Basic ${basicAuthToken}` }
    fetch(apiRoutes.authorize, { headers }).then((response: Response) => {
      if (response.status === 200) {
        props.authorize(basicAuthToken)
      } else if (response.status === 401) {
        alert('invalid data')
      }
    })
  }

  // Block authentication if authenticated user attempts
  // to visit authentication page
  if (props.authenticated) {
    return <Redirect to="/" />
  }

  return (
    <div className="authorization-card">
      <div className="authorization-card__section__login">
        <span className="authorization-card__section__login__title">Sign In</span>
      </div>

      <div className="authorization-card__section__form">
        <form onSubmit={handleSignIn}>
          <div className="authorization-card__section__form__inputs">
            <span>Username</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={formState.username}
              onChange={changeFormState('username')}
              required
            />
          </div>

          <div className="authorization-card__section__form__inputs mt-2">
            <span>Password</span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={formState.password}
              onChange={changeFormState('password')}
              required
            />
          </div>

          <div className="authorization-card__section__form__button mt-3">
            <button type="submit" className="btn btn-success btn-rounded">
              Login
            </button>
            <div className="authorization-card__section__form__button__link">
              <Link to="/auth/restore" className="btn-text-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="authorization-card__section__form__signup mt-5">
            <div className="text-muted">
              <Link to="/auth/signup" className="btn-text-link">
                Click here for sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    (store: StoreRootState) => ({
      authenticated: userSelectors.isAuthenticated(store, null)
    }),
    {
      authorize
    }
  )(SignIn)
)
