import { StoreRootState, UserState } from '#/store/types'
import _ from 'lodash'
import { createSelector } from 'reselect'

// Root
type Props = {} | null

export const getUser = (store: StoreRootState, _: Props) => store.user
export const getProps = (_: StoreRootState, props: Props) => props

export const isAuthenticated = createSelector([getUser], (user: UserState | null) =>
  user ? user.token !== null : false
)

export default { isAuthenticated }
