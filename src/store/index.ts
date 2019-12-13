import { rootLevelReducer } from '#/store/reducers'
import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { StoreRootState } from '#/store/types'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
  }
}

const initialState: StoreRootState = {} as any

const store = (() => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware))
  return createStore(rootLevelReducer as any, initialState as any, enhancer)
})()

export default store
