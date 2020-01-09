import React, { FormEvent, ChangeEvent } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from 'reactstrap'
import { connect } from 'react-redux'
import { createPoll } from '#/store/actions/poll'
import PollQuestionBare from '../PollQuestionBare'
import _ from 'lodash'
import { QuestionContainer, QuestionHash, QuestionAnswerHash } from '#/store/types'

interface CreatePollModalProps {
  isOpen: boolean
  toggleModal: any
  createPoll: (name: string) => Promise<any>
}

const CreatePollModal = (props: CreatePollModalProps) => {
  const [pollTitle, setPollTitle] = React.useState('')
  const [questions, setQuestions] = React.useState<QuestionContainer>({})

  const createPoll = (evt: FormEvent) => {
    evt.preventDefault()

    if (pollTitle) {
      props.createPoll(pollTitle).then(() => {
        props.toggleModal()
      })
    }
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
    setQuestions({ ...questions, [newHash]: { title: '', answers: {} } })
  }

  const onQuestionChange = (hash: string, value: string) => {
    setQuestions({ ...questions, [hash]: { ...questions[hash], title: value } })
  }

  const onQuestionDelete = (hash: string) => {
    setQuestions(_.omit(questions, hash))
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
        answers: { ...questions[questionHash].answers, [createdHash]: '' }
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
              onQuestionCreate={onQuestionCreate}
              onQuestionChange={onQuestionChange}
              onQuestionDelete={onQuestionDelete}
              onAnswerChange={onAnswerChange}
              onAnswerDelete={onAnswerDelete}
              onAnswerCreate={onAnswerCreate}
              container={questions}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Create
          </Button>
          <Button color="secondary" className="ml-2" onClick={props.toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default connect(null, { createPoll })(CreatePollModal)
