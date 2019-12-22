import { Action } from '#/store/types'

export type CreateReducerReducer<S, A> = (state: S, action: A) => S
export type CreateReducerComponents<S, A> = Record<string, CreateReducerReducer<S, A>>
export const createReducer = <S, A extends Action>(components: CreateReducerComponents<S, A>, initialState: S) => (
  state: S = initialState,
  action: A
) => (components.hasOwnProperty(action.type) ? components[action.type](state, action) : state)



