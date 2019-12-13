import { ActionTypes } from '#/store/actions'
import { combineReducers, Action } from 'redux'
import userReducer from '#/store/reducers/user'
import { StoreRootState } from '#/store/types'

export const rootLevelReducer = (state: StoreRootState, action: Action) => {
  if (action.type === ActionTypes.USER.LOGOUT) {
    localStorage.clear()
    state = {} as StoreRootState
  }

  const topLevelReducer = combineReducers({
    user: userReducer
  })

  return topLevelReducer(state as any, action)
}
