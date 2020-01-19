import { StoreRootState, UserState } from '#/store/types'
import { createSelector } from 'reselect'

type Props = {} | null

export const getUser = (store: StoreRootState, _: Props) => store.user
export const getProps = (_: StoreRootState, props: Props) => props

export const getAuthToken = createSelector([getUser], (user: UserState | null) => (user ? user.token : null))

export const isAuthenticated = createSelector([getUser], (user: UserState | null) =>
  user ? user.token !== null : false
)

export default { isAuthenticated, getAuthToken }
