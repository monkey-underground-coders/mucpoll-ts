import { Dispatch } from 'redux'
import { StoreRootState } from '../types'
import ActionTypes from '.'

export const authorize = (token: string) => (dispatch: Dispatch, getState: () => StoreRootState) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: ActionTypes.USER.AUTH, payload: { token } })
    resolve()
  })
}
