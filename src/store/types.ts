export interface Action {
  type: string
}

export type PrimaryKey = number

export type PollQuestionItem = string

export type QuestionHash = string
export type QuestionTitle = string
export type QuestionAnswerHash = string
export type QuestionAnswerTitle = string
export type QuestionContainerItem = { title: QuestionTitle; answers: Record<QuestionAnswerHash, QuestionAnswerTitle> }
export type QuestionContainer = Record<QuestionHash, QuestionContainerItem>

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
