import { Action } from 'redux'
import { createReducer } from '#/store/helpers'
import ActionTypes from '#/store/actions'
import { UserState } from '#/store/types'

const initialState: UserState = {
  token: null
}

export const userReducer = createReducer<UserState, Action>(
  {
    // Logout
    [ActionTypes.USER.LOGOUT]: (state: UserState, action: any) => ({
      ...initialState,
      token: null
    })
  },
  initialState
)

export default userReducer
