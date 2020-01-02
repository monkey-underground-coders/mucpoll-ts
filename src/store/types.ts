export interface Action {
  type: string
}

export type PrimaryKey = number

export interface PollTemplateItemType {
  id: PrimaryKey
  name: string
  questions: Array<any>
  creator: {
    id: PrimaryKey
    status: string
    username: string
  }
}

export interface UserState {
  token: string | null
}

export interface StoreRootState {
  user: UserState
}
