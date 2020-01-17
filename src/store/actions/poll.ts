import { StoreRootState, QuestionsPayload, PollTemplateItemType } from '../types'
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
  return postRequest(apiRoutes.pollQuestion(pid), questions)
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

export const editPoll = (pid: number, name: string) => (
  dispatch: ThunkDispatch<StoreRootState, any, Action>,
  getState: () => StoreRootState
) => {
  dispatch({ type: ActionTypes.POLL.EDIT_POLL_START })
  return putRequest(apiRoutes.poll(pid), { name })
    .then(() => {
      dispatch({ type: ActionTypes.POLL.EDIT_POLL_SUCCESS, payload: { pid, name } })
    })
    .catch(err => {
      console.warn(err)
      dispatch({ type: ActionTypes.POLL.EDIT_POLL_FAIL })
    })
}

export const editPollQuestions = (
  pid: number,
  updatedQuestions: Array<{ title: string; qid: number; index: number; answers: string[] }>,
  createdQuestions: Array<{ title: string; answers: string[] }>
) => (dispatch: ThunkDispatch<StoreRootState, any, Action>, getState: () => StoreRootState) => {
  dispatch({ type: ActionTypes.POLL.EDIT_POLL_QUESTIONS_START })

  return Promise.all([
    putRequest(apiRoutes.pollQuestion(pid as number), updatedQuestions),
    ...(createdQuestions.length ? [postRequest(apiRoutes.pollQuestion(pid as number), createdQuestions)] : [])
  ])
    .then(data => {
      const nextData = data.length > 1 ? data[1] : data[0]
      dispatch({ type: ActionTypes.POLL.EDIT_POLL_QUESTIONS_SUCCESS, payload: { pid, nextData } })
    })
    .catch(err => {
      console.warn(err)
      dispatch({ type: ActionTypes.POLL.EDIT_POLL_QUESTIONS_FAIL })
    })
}
