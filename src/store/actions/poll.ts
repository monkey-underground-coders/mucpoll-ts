import { StoreRootState, QuestionsPayload } from '../types'
import apiRoutes from '#/agent/api'
import ActionTypes from '.'
import { Dispatch, Action } from 'redux'
import { getRequest, postRequest, putRequest, deleteRequest } from '#/agent'
import _ from 'lodash'
import { ThunkDispatch } from 'redux-thunk'

export const getPolls = () => (
  dispatch: ThunkDispatch<StoreRootState, any, Action>,
  getState: () => StoreRootState
) => {
  dispatch({ type: ActionTypes.POLL.GET_POLLS_START })
  return getRequest(apiRoutes.getPolls)
    .then((json: any) => {
      dispatch({ type: ActionTypes.POLL.GET_POLLS_SUCCESS, payload: json })
    })
    .catch(err => {
      dispatch({ type: ActionTypes.POLL.GET_POLLS_FAIL })
    })
}

export const createQuestionsForPoll = (pid: number, questions: QuestionsPayload) => (
  dispatch: ThunkDispatch<StoreRootState, any, Action>,
  getState: () => StoreRootState
) => {
  dispatch({ type: ActionTypes.POLL.CREATE_POLL_QUESTIONS_START })
  return postRequest(apiRoutes.createPollQuestions(pid), questions)
    .then((poll: any) => {
      dispatch({ type: ActionTypes.POLL.CREATE_POLL_QUESTIONS_SUCCESS, payload: { poll } })
      return poll
    })
    .catch(err => {
      console.warn(err)
      dispatch({ type: ActionTypes.POLL.CREATE_POLL_QUESTIONS_FAIL })
    })
}

export const createPoll = (name: string, questions: QuestionsPayload = []) => (
  dispatch: ThunkDispatch<StoreRootState, any, Action>,
  getState: () => StoreRootState
) => {
  dispatch({ type: ActionTypes.POLL.CREATE_POLL_START })
  return postRequest(apiRoutes.createPoll, { name })
    .then((poll: any) => {
      // Get unique poll id from response
      const pid = _.get(poll, 'id', null)
      // If pid is found, then either create questions for specified poll or send
      // an action to finish creating poll
      if (pid !== null) {
        dispatch({ type: ActionTypes.POLL.CREATE_POLL_SUCCESS, payload: { poll } })
        if (questions.length) {
          return dispatch(createQuestionsForPoll(poll.id, questions))
        }
        return poll
      } else {
        dispatch({ type: ActionTypes.POLL.CREATE_POLL_FAIL })
      }
    })
    .catch(err => {
      console.warn(err)
      dispatch({ type: ActionTypes.POLL.CREATE_POLL_FAIL })
    })
}

export const deletePoll = (pid: number) => (
  dispatch: ThunkDispatch<StoreRootState, any, Action>,
  getState: () => StoreRootState
) => {
  dispatch({ type: ActionTypes.POLL.DELETE_POLL_START })
  return deleteRequest(apiRoutes.poll(pid))
    .then(() => {
      dispatch({ type: ActionTypes.POLL.DELETE_POLL_SUCCESS, payload: { pid } })
    })
    .catch(err => {
      console.warn(err)
      dispatch({ type: ActionTypes.POLL.DELETE_POLL_FAIL })
    })
}
