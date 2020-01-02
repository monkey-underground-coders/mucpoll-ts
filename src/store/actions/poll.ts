import { StoreRootState } from '../types'
import apiRoutes from '#/agent/api'
import ActionTypes from '.'
import { Dispatch } from 'redux'
import { getRequest, postRequest } from '#/agent'

export const getPolls = () => (dispatch: Dispatch, getState: () => StoreRootState) => {
  return getRequest(apiRoutes.getPolls).then((json: any) => {
    dispatch({ type: ActionTypes.POLL.GET_POLLS, payload: json })
  })
}

export const createPoll = (name: string) => (dispatch: Dispatch, getState: () => StoreRootState) => {
  return postRequest(apiRoutes.createPoll, { name }).then((json: any) => {
    dispatch({ type: ActionTypes.POLL.CREATE, payload: json })
  })
}
