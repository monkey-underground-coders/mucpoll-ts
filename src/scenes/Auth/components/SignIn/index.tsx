import React, { FormEvent } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import apiRoutes from '#/agent/api'
import { connect } from 'react-redux'
import { authorize } from '#/store/actions/user'
import './index.scss'

interface SignInProps extends RouteComponentProps {
  authorize: (token: string) => Promise<any>
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
    const headers = {
      Authorization: `Basic ${basicAuthToken}`,
      'X-Requested-With': 'XMLHttpRequest',
      'access-control-allow-origin': 'https://mucpoll.a6raywa1cher.com'
    }
    fetch(apiRoutes.authorize, { headers }).then((response: Response) => {
      if (response.ok) {
        props.authorize(basicAuthToken).then(() => {
          window.localStorage.setItem('token', JSON.stringify(basicAuthToken))
        })
      } else if (response.status === 401) {
        // TODO: Handle erroring
        alert('invalid data')
      }
    })
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
  connect(null, {
    authorize
  })(SignIn)
)
