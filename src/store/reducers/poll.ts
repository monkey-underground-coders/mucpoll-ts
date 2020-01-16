import ActionTypes from '../actions'
import { createReducer } from '../helpers'
import { Action } from 'redux'
import { PollState, PollTemplateItemType } from '../types'
import _ from 'lodash'

const initialState: PollState = {
  polls: [],
  // Poll fetching
  pollsLoading: false,
  pollsLoadingFailed: false,
  // Poll creating
  pollCreating: false,
  pollCreatingFailed: false,
  // Poll deleting
  pollDeleting: false,
  pollDeletingFailed: false,
  // Poll question creating
  pollQuestionsCreating: false,
  pollQuestionsCreatingFailed: false
}

export const pollReducer = createReducer<PollState, Action>(
  {
    [ActionTypes.POLL.GET_POLLS_START]: (state: PollState, action: any) => ({
      ...state,
      pollsLoading: true
    }),

    [ActionTypes.POLL.GET_POLLS_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: action.payload.reduce(
        (acc: Record<number, PollTemplateItemType>, poll: PollTemplateItemType) => ({ ...acc, [poll.id]: poll }),
        {}
      ),
      pollsLoading: false,
      pollsLoadingfailed: false
    }),

    [ActionTypes.POLL.GET_POLLS_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollsLoading: false,
      pollsLoadingFailed: true
    }),

    [ActionTypes.POLL.CREATE_POLL_START]: (state: PollState, action: any) => ({
      ...state,
      pollCreating: true,
      pollCreatingFailed: false
    }),

    [ActionTypes.POLL.CREATE_POLL_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: { ...state.polls, [action.payload.poll.id]: action.payload.poll },
      pollCreating: false
    }),

    [ActionTypes.POLL.CREATE_POLL_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollCreating: false,
      pollCreatingFailed: true
    }),

    [ActionTypes.POLL.CREATE_POLL_QUESTIONS_START]: (state: PollState, action: any) => ({
      ...state,
      pollQuestionsCreating: true,
      pollQuestionsCreatingFailed: false
    }),

    [ActionTypes.POLL.CREATE_POLL_QUESTIONS_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: { ...state.polls, [action.payload.poll.id]: action.payload.poll },
      pollQuestionsCreating: false,
      pollQuestionsCreatingFailed: false
    }),

    [ActionTypes.POLL.CREATE_POLL_QUESTIONS_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollQuestionsCreating: false,
      pollQuestionsCreatingFailed: true
    }),

    [ActionTypes.POLL.DELETE_POLL_START]: (state: PollState, action: any) => ({
      ...state,
      pollDeleting: true,
      pollDeletingFailed: false
    }),

    [ActionTypes.POLL.DELETE_POLL_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: _.omit(state.polls, action.payload.pid),
      pollDeleting: false,
      pollDeletingFailed: false
    }),

    [ActionTypes.POLL.DELETE_POLL_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollDeleting: false,
      pollDeletingFailed: true
    })
  },
  initialState
)

export default pollReducer
