import ActionTypes from '../actions'
import { createReducer } from '../helpers'
import { Action } from 'redux'
import { PollState, PollTemplateItemType } from '../types'
import _ from 'lodash'

const initialState: PollState = {
  polls: {
    content: [],
    settings: {}
  },
  // Poll fetching
  pollsLoading: false,
  pollsLoadingFailed: false,
  // Poll creating
  pollCreating: false,
  pollCreatingFailed: false,
  // Poll deleting
  pollDeleting: false,
  pollDeletingFailed: false,
  // Poll editing
  pollEditing: false,
  pollEditingFailed: false,
  // Poll question creating
  pollQuestionsCreating: false,
  pollQuestionsCreatingFailed: false,
  // Poll question editing
  pollQuestionsEditing: false,
  pollQuestionsEditingFailed: false
}

export const pollReducer = createReducer<PollState, Action>(
  {
    [ActionTypes.POLL.GET_POLLS_START]: (state: PollState, action: any) => ({
      ...state,
      pollsLoading: true
    }),

    [ActionTypes.POLL.GET_POLLS_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: {
        content: action.payload.content.reduce(
          (acc: Record<number, PollTemplateItemType>, poll: PollTemplateItemType) => ({ ...acc, [poll.id]: poll }),
          {}
        ),
        settings: {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          number: action.payload.number
        }
      },
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
      polls: { ...state.polls, content: { ...state.polls.content, [action.payload.poll.id]: action.payload.poll } },
      pollCreating: false,
      pollCreatingFailed: true
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
      polls: { ...state.polls, content: { ...state.polls.content, [action.payload.poll.id]: action.payload.poll } },
      pollQuestionsCreating: false,
      pollQuestionsCreatingFailed: false
    }),

    [ActionTypes.POLL.CREATE_POLL_QUESTIONS_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollQuestionsCreating: false,
      pollQuestionsCreatingFailed: true
    }),

    // Poll questions editing
    [ActionTypes.POLL.EDIT_POLL_QUESTIONS_START]: (state: PollState, action: any) => ({
      ...state,
      pollQuestionsEditing: true,
      pollQuestionsEditingFailed: false
    }),

    [ActionTypes.POLL.EDIT_POLL_QUESTIONS_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: { ...state.polls, content: { ...state.polls.content, [action.payload.pid]: action.payload.nextData } },
      pollQuestionsEditing: false,
      pollQuestionsEditingFailed: false
    }),

    [ActionTypes.POLL.EDIT_POLL_QUESTIONS_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollQuestionsEditing: false,
      pollQuestionsEditingFailed: true
    }),

    // Poll editing
    [ActionTypes.POLL.EDIT_POLL_START]: (state: PollState, action: any) => ({
      ...state,
      pollEditing: true,
      pollEditingFailed: false
    }),

    [ActionTypes.POLL.EDIT_POLL_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: {
        ...state.polls,
        content: {
          ...state.polls.content,
          [action.payload.pid]: { ...state.polls.content[action.payload.pid], name: action.payload.name }
        }
      },
      pollEditing: false,
      pollEditingFailed: false
    }),

    [ActionTypes.POLL.EDIT_POLL_FAIL]: (state: PollState, action: any) => ({
      ...state,
      pollEditing: false,
      pollEditingFailed: true
    }),

    [ActionTypes.POLL.DELETE_POLL_START]: (state: PollState, action: any) => ({
      ...state,
      pollDeleting: true,
      pollDeletingFailed: false
    }),

    [ActionTypes.POLL.DELETE_POLL_SUCCESS]: (state: PollState, action: any) => ({
      ...state,
      polls: { ...state.polls, content: _.omit(state.polls.content, action.payload.pid) },
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
