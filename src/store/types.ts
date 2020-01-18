export interface Action {
  type: string
}

export type Polls = Pick<PollTemplateItemType[], number>
export type PrimaryKey = number
export type PollQuestionItem = string
export type QuestionsPayload = Array<{ answers: string[]; title: string }>
export type QuestionHash = string | number
export type QuestionTitle = string
export type QuestionAnswerHash = string | number
export type QuestionAnswerTitle = string
export type QuestionContainerItem = { title: QuestionTitle; answers: Record<QuestionAnswerHash, QuestionAnswerTitle> }
export type QuestionContainer = Record<QuestionHash, QuestionContainerItem>
export type AnswerSignature = { aid: number; count: number }
export type AnswerOption = { answer: string; id: number; index: number; pollQuestion: number }
export type Question = {
  answerOptions: Array<AnswerOption>
  id: number
  index: number
  poll: number
  question: string
}

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

export type PollHistoryRecordedQuestions = Array<{
  qid: number
  question: string
  recordedData: Array<{ aid: number; answer: string; count: number }>
}>

export type PollHistoryItem = {
  sid: string
  pollInfo: {
    id: number
    name: string
    questions: any[]
    creator: any
    launchedCount: number
    tags: any[]
  }
  pid: number
  recordedQuestions: PollHistoryRecordedQuestions
  startedAt: string
  recordedAt: string
}

export interface UserState {
  token: string | null
}

export interface PollState {
  polls: Polls
  pollsLoading: boolean
  pollsLoadingFailed: boolean
  pollCreating: boolean
  pollCreatingFailed: boolean
  pollDeleting: boolean
  pollDeletingFailed: boolean
  pollEditing: boolean
  pollEditingFailed: boolean
  pollQuestionsCreating: boolean
  pollQuestionsCreatingFailed: boolean
  pollQuestionsEditing: boolean
  pollQuestionsEditingFailed: boolean
}

export interface StoreRootState {
  user: UserState
  poll: PollState
}
