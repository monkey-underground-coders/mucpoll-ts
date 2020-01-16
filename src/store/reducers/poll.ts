import ActionTypes from '../actions'
import { createReducer } from '../helpers'
import { Action } from 'redux'
import { PollState } from '../types'

const initialState: PollState = {
  polls: [],
  pollsLoading: false,
  pollsLoadingFailed: false
}

export const pollReducer = createReducer<PollState, Action>(
  {
    [ActionTypes.POLL.GET_POLLS_START]: (state: PollState, action: any) => ({
      ...state,
      pollsLoading: true
    }),

    [ActionTypes.POLL.GET_POLLS_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: action.payload,
      pollsLoading: false,
      pollsLoadingfailed: false
    }),

    [ActionTypes.POLL.GET_POLLS_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollsLoading: false,
      pollsLoadingFailed: true
    }),

    [ActionTypes.POLL.CREATE]: (state: PollState, action: any) => ({
      ...state,
      polls: [...state.polls, action.payload]
    })
  },
  initialState
)

export default pollReducer
