import React, { ChangeEvent } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { connect } from 'react-redux'
import { createPoll } from '#/store/actions/poll'
import PollQuestionBare from '../PollQuestionBare'
import {
  QuestionContainer,
  QuestionHash,
  QuestionAnswerHash,
  QuestionContainerItem,
  QuestionsPayload,
  StoreRootState
} from '#/store/types'
import _ from 'lodash'
import { reorder } from '#/utils/functions'
import Loader from '#/components/Loader'

interface CreatePollModalProps {
  isOpen: boolean
  toggleModal: any
  pollCreating: boolean
  createPoll: (name: string, questions: QuestionsPayload) => Promise<any>
}

const CreatePollModal = (props: CreatePollModalProps) => {
  const [pollTitle, setPollTitle] = React.useState<string>('')
  const [questions, setQuestions] = React.useState<QuestionContainer>({})

  const createPoll = (event: React.FormEvent) => {
    event.preventDefault()
    if (pollTitle && !props.pollCreating) {
      const questions = constructQuestionsToRequest()
      props.createPoll(pollTitle, questions).then((json: any) => {
        props.toggleModal()
        setPollTitle('')
        setQuestions({})
      })
    }
  }

  const constructQuestionsToRequest = () => {
    return Object.values(questions).map((question: QuestionContainerItem) => ({
      title: question.title,
      answers: Object.values(question.answers)
        .map((question: string) => question.trim())
        .filter(q => q)
    }))
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPollTitle(e.target.value)
  }

  /**
   * Question actions
   * @function onQuestionCreate Creation handler
   * @function onQuestionChange Change handler
   * @function onQuestionDelete Deletion handler
   */
  const onQuestionCreate = () => {
    const newHash = `q${new Date().getTime()}`
    setQuestions({ ...questions, [newHash]: { title: '', answers: {}, hash: newHash, editMode: true } })
  }

  const onQuestionChange = (hash: QuestionHash, value: string) => {
    setQuestions({ ...questions, [hash]: { ...questions[hash], title: value } })
  }

  const onQuestionDelete = (hash: QuestionHash) => {
    setQuestions(_.omit(questions, hash))
  }

  const toggleQuestionEditMode = (questionHash: QuestionHash) => {
    setQuestions({
      ...questions,
      [questionHash]: { ...questions[questionHash], editMode: !questions[questionHash].editMode as boolean }
    })
  }

  /**
   * Answer actions
   * @function onAnswerCreate Creation handler
   * @function onAnswerChange Change handler
   * @function onAnswerDelete Deletion handler
   */
  const onAnswerCreate = (questionHash: QuestionHash) => {
    const createdHash = `ans${new Date().getTime()}`
    setQuestions({
      ...questions,
      [questionHash]: {
        ...questions[questionHash],
        answers: { ...questions[questionHash].answers, [createdHash]: '' },
        editMode: false
      }
    })
  }

  const onAnswerDelete = (questionHash: QuestionHash, answerHash: QuestionAnswerHash) => {
    setQuestions({
      ...questions,
      [questionHash]: {
        ...questions[questionHash],
        answers: _.omit(questions[questionHash].answers, answerHash)
      }
    })
  }

  const onAnswerChange = (questionHash: QuestionHash, answerHash: QuestionAnswerHash, nextValue: string) => {
    setQuestions({
      ...questions,
      [questionHash]: {
        ...questions[questionHash],
        answers: { ...questions[questionHash].answers, [answerHash]: nextValue }
      }
    })
  }

  const onDragEnd = (result: any) => {
    if (result.destination && result.destination.index !== result.source.index) {
      const _questions = reorder(Object.values(questions), result.source.index, result.destination.index)
      setQuestions(
        _questions.reduce(
          (_nextQuestions: QuestionContainer, _question: any) => ({
            ..._nextQuestions,
            [_question.hash]: _question
          }),
          {}
        )
      )
    }
  }

  return (
    <Modal size="lg" isOpen={props.isOpen} toggle={props.toggleModal} contentClassName="alert alert-primary">
      <ModalHeader toggle={props.toggleModal}>Create new Poll</ModalHeader>
      <form onSubmit={createPoll}>
        <ModalBody>
          <div className="box box-bordered">
            <div className="box__header">Poll title</div>
            <div className="box__header">
              <input
                type="text"
                className="form-control"
                value={pollTitle}
                onChange={onTitleChange}
                placeholder="Poll"
                required
              />
            </div>
          </div>

          <div className="mt-2">
            <PollQuestionBare
              toggleQuestionEditMode={toggleQuestionEditMode}
              onQuestionCreate={onQuestionCreate}
              onQuestionChange={onQuestionChange}
              onQuestionDelete={onQuestionDelete}
              onAnswerChange={onAnswerChange}
              onAnswerDelete={onAnswerDelete}
              onAnswerCreate={onAnswerCreate}
              onDragEnd={onDragEnd}
              container={questions}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" type="button" onClick={props.toggleModal}>
            Cancel
          </button>

          <button className="btn btn-primary" type="button" onClick={createPoll} disabled={props.pollCreating}>
            {props.pollCreating ? <Loader small={true} /> : 'Create'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default connect(
  (store: StoreRootState) => ({
    pollCreating: store.poll.pollCreating,
    pollCreatingFailed: store.poll.pollCreatingFailed
  }),
  { createPoll }
)(CreatePollModal)
