import React, { FormEvent } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import apiRoutes from '#/agent/api'
import { connect } from 'react-redux'
import { authorize } from '#/store/actions/user'
import { generatebase64 } from '#/utils/functions'
import '../SignIn/index.scss'
import Loader from '#/components/Loader'

interface SignUpProps extends RouteComponentProps {
  authorize: (token: string) => Promise<any>
}

const SignUp = (props: SignUpProps) => {
  const [fetching, setFetching] = React.useState<boolean>(false)
  const [formState, setFormState] = React.useState<{ username: string; password: string }>({
    username: '',
    password: ''
  })

  const changeFormState = (formField: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [formField]: event.target.value })
  }

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault()
    const { username, password } = formState
    if (username && password && !fetching) {
      setFetching(true)
      const basicAuthToken = generatebase64([username, password])
      fetch(apiRoutes.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, username })
      }).then((response: Response) => {
        if (response.ok) {
          props.authorize(basicAuthToken).then(() => {
            window.localStorage.setItem('token', JSON.stringify(basicAuthToken))
            window.localStorage.setItem('username', JSON.stringify(username))
            window.localStorage.setItem('password', JSON.stringify(password))
          })
        } else if (response.status === 401) {
          // TODO: Handle erroring
          alert('invalid data')
        }
        setFetching(false)
      })
    }
  }

  return (
    <div className="authorization-card">
      <div className="authorization-card__section__login">
        <span className="authorization-card__section__login__title">Register</span>
      </div>

      <div className="authorization-card__section__form">
        <form onSubmit={handleSignUp}>
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
            <button type="submit" className="btn btn-success btn-rounded" disabled={fetching}>
              {fetching ? <Loader small={true} /> : 'Register'}
            </button>
          </div>

          <div className="authorization-card__section__form__signup mt-5">
            <div className="text-muted">
              <Link to="/" className="btn-text-link">
                Click here for sign in
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
  })(SignUp)
)
