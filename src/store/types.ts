export interface Action {
  type: string
}

export interface UserState {
  token: string | null
}

export interface StoreRootState {
  user: UserState
}
