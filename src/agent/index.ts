import store from '#/store'
import _ from 'lodash'
import { getAuthToken } from '#/store/selectors/user'

export const constructGenericRequestHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://mucpoll.a6raywa1cher.com'
})

export const constructRequestHeaders = (params = {}) => {
  const authToken = getAuthToken(store.getState() as any, null)
  return {
    ...constructGenericRequestHeaders(),
    ...(authToken ? { Authorization: `Basic ${authToken}` } : {}),
    ...params
  }
}

const badRequestHandler = (response: Response) => {}
const badGatewayHandler = (response: Response) => {}
const serviceUnavailableHandler = (response: Response) => {}

const responseErrorHandlers = (response: Response) => ({
  400: (response: Response) => badRequestHandler(response),
  502: (response: Response) => badGatewayHandler(response),
  503: (response: Response) => serviceUnavailableHandler(response)
})

const getErrorHandler = (response: Response) => {
  return _.get(responseErrorHandlers, response.status, () => {
    console.error(`An error occured while sending a request with status ${response.status}`)
  })
}

const initialResponseHandler = (response: Response) => {
  if (!response.ok) {
    getErrorHandler(response)
  }
  return response.json()
}

export const postRequest = (url: string, body = {}) =>
  fetch(url, {
    method: 'POST',
    headers: constructRequestHeaders(),
    body: JSON.stringify(body)
  }).then(initialResponseHandler)

export const getRequest = (url: string) =>
  fetch(url, {
    headers: constructRequestHeaders()
  }).then(initialResponseHandler)

export const putRequest = (url: string, body = {}) =>
  fetch(url, {
    method: 'PUT',
    headers: constructRequestHeaders(),
    body: JSON.stringify(body)
  }).then(initialResponseHandler)

export const putRequestWithoutHandler = (url: string, body = {}) =>
  fetch(url, {
    method: 'PUT',
    headers: constructRequestHeaders(),
    body: JSON.stringify(body)
  })

export const deleteRequest = (url: string) =>
  fetch(url, {
    method: 'DELETE',
    headers: constructRequestHeaders()
  })
