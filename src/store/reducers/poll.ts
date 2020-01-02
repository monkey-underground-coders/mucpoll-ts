import ActionTypes from '../actions'
import { createReducer } from '../helpers'
import { Action } from 'redux'
import { PollState } from '../types'

const initialState: PollState = {
  polls: []
}

export const pollReducer = createReducer<PollState, Action>(
  {
    [ActionTypes.POLL.GET_POLLS]: (state: PollState, action: any) => ({
      ...state,
      polls: action.payload
    }),

    [ActionTypes.POLL.CREATE]: (state: PollState, action: any) => ({
      ...state,
      polls: [...state.polls, action.payload]
    })
  },
  initialState
)

export default pollReducer
