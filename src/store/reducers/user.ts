import { Action } from 'redux'
import { createReducer } from '#/store/helpers'
import ActionTypes from '#/store/actions'
import { UserState } from '#/store/types'
import { getLocalStorageItem } from '#/utils/functions'

const loadStateFromLocalStorage = () => ({
  token: getLocalStorageItem('token')
})

const initialState: UserState = {
  ...loadStateFromLocalStorage()
}

export const userReducer = createReducer<UserState, Action>(
  {
    // Logout
    [ActionTypes.USER.LOGOUT]: (state: UserState, action: any) => ({
      ...state,
      token: null
    }),

    // Successful authorization
    [ActionTypes.USER.AUTH]: (state: UserState, action: any) => ({
      ...state,
      token: action.payload.token
    })
  },
  initialState
)

export default userReducer
