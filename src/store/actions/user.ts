import { Dispatch } from 'redux'
import ActionTypes from '.'

export const authorize = (token: string) => (dispatch: Dispatch) => {
  return new Promise(resolve => {
    dispatch({ type: ActionTypes.USER.AUTH, payload: { token } })
    resolve()
  })
}

export const logout = () => (dispatch: Dispatch) => {
  return new Promise(resolve => {
    dispatch({ type: ActionTypes.USER.LOGOUT })
    window.localStorage.clear()
    resolve()
  })
}
