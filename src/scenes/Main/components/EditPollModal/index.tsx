import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { connect } from 'react-redux'
import {
  StoreRootState,
  Polls,
  Question,
  QuestionContainer,
  QuestionHash,
  QuestionAnswerHash,
  AnswerOption,
  QuestionContainerItem
} from '#/store/types'
import _ from 'lodash'
import PollQuestionBare from '../PollQuestionBare'
import { editPoll } from '#/store/actions/poll'

interface EditPollModalProps {
  isOpen: boolean
  toggle: () => void
  pid: number | null
  polls?: Polls
  editPoll: (
    pid: number,
    name: string,
    list: Array<{ title: string; answers: string[] }>,
    tags: string[]
  ) => Promise<any>
  pollQuestionsEditing: boolean
}

const EditPollModal = (props: EditPollModalProps) => {
  const [pollName, setPollName] = React.useState<string | null>(null)
  const [pollData, setPollData] = React.useState<{
    name: string | null
    questions: Array<Question> | null
    tags: string[] | null
  }>({
    name: null,
    questions: null,
    tags: null
  })
  const [newlyCreatedQuestions, setNewlyCreatedQuestions] = React.useState<QuestionContainer>({})

  React.useEffect(() => {
    if (props.pid) {
      const currentPoll = _.get(props.polls, props.pid, null)
      if (currentPoll) {
        const constructQuestionsContainer = currentPoll.questions.reduce(
          (questionsAcc, question: Question) => ({
            ...questionsAcc,
            [question.id]: {
              title: question.question,
              answers: question.answerOptions.reduce(
                (answersAcc, answerOption: AnswerOption) => ({
                  ...answersAcc,
                  [answerOption.id]: answerOption.answer
                }),
                {}
              )
            }
          }),
          {}
        )
        setPollName(currentPoll.name)
        setPollData({ name: currentPoll.name, questions: currentPoll.questions, tags: currentPoll.tags })
        setNewlyCreatedQuestions(constructQuestionsContainer)
      }
    }
  }, [props.pid])

  const onQuestionCreate = () => {
    const hash = `QuestionHash_${new Date().getTime()}`
    setNewlyCreatedQuestions({ ...newlyCreatedQuestions, [hash]: { title: '', answers: {} } })
  }

  const onQuestionChange = (hash: QuestionHash, value: string) => {
    setNewlyCreatedQuestions({ ...newlyCreatedQuestions, [hash]: { ...newlyCreatedQuestions[hash], title: value } })
  }

  const onQuestionDelete = (hash: QuestionHash) => {
    setNewlyCreatedQuestions(_.omit(newlyCreatedQuestions, hash))
  }

  const onAnswerCreate = (questionHash: QuestionHash) => {
    const createdHash = `QuestionAnswer_${new Date().getTime()}`
    setNewlyCreatedQuestions({
      ...newlyCreatedQuestions,
      [questionHash]: {
        ...newlyCreatedQuestions[questionHash],
        answers: { ...newlyCreatedQuestions[questionHash].answers, [createdHash]: '' }
      }
    })
  }

  const onAnswerDelete = (questionHash: QuestionHash, answerHash: QuestionAnswerHash) => {
    setNewlyCreatedQuestions({
      ...newlyCreatedQuestions,
      [questionHash]: {
        ...newlyCreatedQuestions[questionHash],
        answers: _.omit(newlyCreatedQuestions[questionHash].answers, answerHash)
      }
    })
  }

  const onAnswerChange = (questionHash: QuestionHash, answerHash: QuestionAnswerHash, nextValue: string) => {
    setNewlyCreatedQuestions({
      ...newlyCreatedQuestions,
      [questionHash]: {
        ...newlyCreatedQuestions[questionHash],
        answers: { ...newlyCreatedQuestions[questionHash].answers, [answerHash]: nextValue }
      }
    })
  }

  const updateQuestions = () => {
    if (props.pollQuestionsEditing) return

    const questionsKeys = Object.keys(newlyCreatedQuestions)

    const updatedQuestionsKeys = questionsKeys
      .filter((questionKey: QuestionHash) => !isNaN(questionKey as number))
      .map(questionKey => _.toNumber(questionKey))

    const updatedQuestions = updatedQuestionsKeys.reduce(
      (updatedQuestionsAcc: Array<{ title: string; answers: string[] }>, questionKey: number) => {
        const _originalQuestion = pollData.questions?.find((q: Question) => q.id === questionKey)
        const _nextQuestion = newlyCreatedQuestions[questionKey]

        if (Object.values(_nextQuestion.answers).length) {
          return [
            ...updatedQuestionsAcc,
            {
              title: _nextQuestion.title,
              answers: Object.values(_nextQuestion.answers)
            }
          ]
        }

        return updatedQuestionsAcc
      },
      []
    )

    const createdQuestionsKeys = questionsKeys.filter((questionKey: QuestionHash) => isNaN(questionKey as number))

    const createdQuestions = createdQuestionsKeys.reduce(
      (createdQuestionsAcc: Array<{ title: string; answers: string[] }>, questionKey: string) => {
        const _createdQuestion = newlyCreatedQuestions[questionKey]
        if (Object.values(_createdQuestion.answers).length) {
          return [
            ...createdQuestionsAcc,
            { title: _createdQuestion.title, answers: Object.values(_createdQuestion.answers) }
          ]
        }
        return createdQuestionsAcc
      },
      []
    )

    props
      .editPoll(
        props.pid as number,
        pollData.name as string,
        [...updatedQuestions, ...createdQuestions],
        pollData.tags as string[]
      )
      .then(() => {
        props.toggle()
      })
  }

  return (
    <Modal size="lg" isOpen={props.isOpen} toggle={props.toggle} contentClassName="alert alert-primary">
      <ModalHeader toggle={props.toggle}>Edit questions for {pollName}</ModalHeader>
      <ModalBody>
        {pollData.name ? (
          <>
            <div className="box box-bordered">
              <div className="box__header">Poll title</div>
              <div className="box__header">
                <input
                  type="text"
                  className="form-control"
                  value={pollData.name}
                  onChange={e => setPollData({ ...pollData, name: e.target.value })}
                  placeholder="Poll"
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <PollQuestionBare
                onQuestionCreate={onQuestionCreate}
                onQuestionChange={onQuestionChange}
                onQuestionDelete={onQuestionDelete}
                onAnswerChange={onAnswerChange}
                onAnswerDelete={onAnswerDelete}
                onAnswerCreate={onAnswerCreate}
                container={newlyCreatedQuestions}
              />
            </div>
          </>
        ) : (
          <div>Loading</div>
        )}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={props.toggle}>
          Close
        </button>
        <button className="btn btn-success ml-2" onClick={updateQuestions} disabled={props.pollQuestionsEditing}>
          Save
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default connect(
  (store: StoreRootState) => ({
    polls: store.poll.polls,
    pollQuestionsEditing: store.poll.pollQuestionsEditing
  }),
  { editPoll }
)(EditPollModal)
