import { Action } from 'redux'
import { createReducer } from '#/store/helpers'
import ActionTypes from '#/store/actions'
import { UserState } from '#/store/types'

const loadStateFromLocalStorage = () => ({
  token: (() => {
    const t = window.localStorage.getItem('token')
    return t ? JSON.parse(t) : null
  })()
})

const initialState: UserState = {
  ...loadStateFromLocalStorage()
}

export const userReducer = createReducer<UserState, Action>(
  {
    // Logout
    [ActionTypes.USER.LOGOUT]: (state: UserState, action: any) => ({
      ...initialState,
      token: null
    }),

    // Successful authorization
    [ActionTypes.USER.AUTH]: (state: UserState, action: any) => ({
      ...initialState,
      token: action.payload.token
    })
  },
  initialState
)

export default userReducer
