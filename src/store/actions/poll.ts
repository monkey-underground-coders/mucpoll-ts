import { StoreRootState } from '../types'
import apiRoutes from '#/agent/api'
import ActionTypes from '.'
import { Dispatch } from 'redux'
import { getRequest, postRequest } from '#/agent'

export const getPolls = () => (dispatch: Dispatch, getState: () => StoreRootState) => {
  dispatch({ type: ActionTypes.POLL.GET_POLLS_START })
  return getRequest(apiRoutes.getPolls)
    .then((json: any) => {
      dispatch({ type: ActionTypes.POLL.GET_POLLS_SUCCESS, payload: json })
    })
    .catch(err => {
      dispatch({ type: ActionTypes.POLL.GET_POLLS_FAIL })
    })
}

export const createPoll = (name: string) => (dispatch: Dispatch, getState: () => StoreRootState) => {
  return postRequest(apiRoutes.createPoll, { name }).then((json: any) => {
    dispatch({ type: ActionTypes.POLL.CREATE, payload: json })
  })
}
