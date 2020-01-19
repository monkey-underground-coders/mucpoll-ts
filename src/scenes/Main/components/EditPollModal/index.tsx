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
import { reorder } from '#/utils/functions'

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
      const currentPoll = _.get(props!.polls!.content, props.pid, null)
      if (currentPoll) {
        const constructQuestionsContainer = currentPoll.questions.reduce(
          (questionsAcc, question: Question) => ({
            ...questionsAcc,
            [question.id.toString()]: {
              title: question.question,
              answers: question.answerOptions.reduce(
                (answersAcc, answerOption: AnswerOption) => ({
                  ...answersAcc,
                  [answerOption.id]: answerOption.answer
                }),
                {}
              ),
              hash: question.id.toString(),
              editMode: false
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
    setNewlyCreatedQuestions({ ...newlyCreatedQuestions, [hash]: { title: '', answers: {}, hash, editMode: true } })
  }

  const onQuestionChange = (hash: QuestionHash, value: string) => {
    setNewlyCreatedQuestions({ ...newlyCreatedQuestions, [hash]: { ...newlyCreatedQuestions[hash], title: value } })
  }

  const onQuestionDelete = (hash: QuestionHash) => {
    setNewlyCreatedQuestions(_.omit(newlyCreatedQuestions, hash))
  }

  const toggleQuestionEditMode = (questionHash: QuestionHash) => {
    setNewlyCreatedQuestions({
      ...newlyCreatedQuestions,
      [questionHash]: {
        ...newlyCreatedQuestions[questionHash],
        editMode: !newlyCreatedQuestions[questionHash].editMode
      }
    })
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

  // TODO: Fix a bug when deleting answer
  const onAnswerDelete = (questionHash: QuestionHash, answerHash: QuestionAnswerHash) => {
    console.log('onAnswerDelete')
    console.log('q', newlyCreatedQuestions[questionHash])
    console.log('a', newlyCreatedQuestions[questionHash].answers[answerHash])
    console.log('prevstate', newlyCreatedQuestions)
    setNewlyCreatedQuestions({
      ...newlyCreatedQuestions,
      [questionHash]: {
        ...newlyCreatedQuestions[questionHash],
        answers: _.omit(newlyCreatedQuestions[questionHash].answers, [answerHash])
      }
    })
    console.log('nextState', newlyCreatedQuestions)
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

  const onDragEnd = (result: any) => {
    if (result.destination && result.destination.index !== result.source.index) {
      const _questions = reorder(Object.values(newlyCreatedQuestions), result.source.index, result.destination.index)
      setNewlyCreatedQuestions(
        _questions.reduce(
          (_nextQuestions: QuestionContainer, _question: any) => ({
            ..._nextQuestions,
            [`q${_question.hash}`]: _question
          }),
          {}
        )
      )
    }
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
        const _answers = Object.values(_nextQuestion.answers).filter(e => e)

        if (_answers.length) {
          return [
            ...updatedQuestionsAcc,
            {
              title: _nextQuestion.title,
              answers: _answers
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
        const _answers = Object.values(_createdQuestion.answers).filter(e => e)
        if (_answers.length) {
          return [...createdQuestionsAcc, { title: _createdQuestion.title, answers: _answers }]
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
                toggleQuestionEditMode={toggleQuestionEditMode}
                onQuestionCreate={onQuestionCreate}
                onQuestionChange={onQuestionChange}
                onQuestionDelete={onQuestionDelete}
                onAnswerChange={onAnswerChange}
                onAnswerDelete={onAnswerDelete}
                onAnswerCreate={onAnswerCreate}
                container={newlyCreatedQuestions}
                onDragEnd={onDragEnd}
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
