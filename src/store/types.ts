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
  launchedCount: number
  tags: Array<any>
}

export interface UserState {
  token: string | null
}

export interface PollState {
  polls: Array<PollTemplateItemType>
}

export interface StoreRootState {
  user: UserState
  poll: PollState
}
