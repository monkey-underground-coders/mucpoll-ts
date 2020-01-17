import React from 'react'
import _ from 'lodash'
import './index.scss'
import { postRequest } from '#/agent'
import { QuestionContainerItem, QuestionHash, QuestionAnswerHash } from '#/store/types'

interface PollQuestionAnswerProps {
  hash: QuestionAnswerHash
  answer: string
  onDelete: () => void
  onChange: (hash: QuestionAnswerHash, value: string) => void
}

interface PollQuestionProps {
  hash: QuestionHash
  readonly?: boolean
  question: QuestionContainerItem
  onAnswerCreate: () => void
  onAnswerDelete: (answerHash: QuestionAnswerHash) => void
  onAnswerChange: (answerHash: QuestionAnswerHash, value: string) => void
  onQuestionChange: (value: string) => void
  onQuestionDelete: () => void
}

const PollQuestionAnswer = (props: PollQuestionAnswerProps) => {
  const [editMode, setEditMode] = React.useState<Boolean>(true)

  const toggleEdit = () => {
    if (props.answer) {
      setEditMode(!editMode)
    }
  }

  const removeItem = () => props.onDelete()

  const changeItem = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.hash, e.target.value)

  return (
    <div className="question-item__layout__answers__item">
      <div>
        {editMode ? (
          <input type="text" className="form-control" value={props.answer} onChange={changeItem} placeholder="Answer" />
        ) : (
          <span>{props.answer}</span>
        )}
      </div>

      <div>
        <button type="button" className="btn btn-list" onClick={toggleEdit}>
          {editMode ? <i className="fas fa-check"></i> : <i className="fas fa-pen"></i>}
        </button>
        <button type="button" className="btn btn-list ml-2" onClick={removeItem}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

const PollQuestion = (props: PollQuestionProps) => {
  const { title, answers } = props.question
  const [editMode, setEditMode] = React.useState<Boolean>(true)

  const toggleEdit = () => {
    if (title) {
      setEditMode(!editMode)
    }
  }

  const renderedAnswers = Object.keys(answers).map((hash: string, index: number) => {
    const answer = answers[hash]
    return (
      <div className="d-flex align-items-center px-2" key={index}>
        <span>{index + 1}.</span>
        <div className="ml-2 w-100">
          <PollQuestionAnswer
            key={`ans${hash}`}
            hash={hash}
            onChange={props.onAnswerChange}
            onDelete={() => props.onAnswerDelete(hash)}
            answer={answer}
          />
        </div>
      </div>
    )
  })

  const renderedTitle = editMode ? (
    <input
      type="text"
      placeholder="Question title"
      className="form-control w-100"
      value={title}
      onChange={e => props.onQuestionChange(e.target.value)}
      required
    />
  ) : (
    <span>{title}</span>
  )

  return (
    <div className="question-item">
      <div className="question-item__layout">
        <div className="question-item__layout__title">
          <div className="question-item__layout__title__name">{renderedTitle}</div>
          <div className="question-item__layout__title__actions">
            <button
              type="button"
              className="btn-list btn ml-2"
              disabled={props.readonly}
              onClick={props.onAnswerCreate}
            >
              <i className="fas fa-plus"></i>
              <span className="ml-1">Add answer</span>
            </button>

            {editMode ? (
              <button type="button" className="btn-list btn" onClick={toggleEdit}>
                <i className="fas fa-check"></i>
                <span className="ml-1">Save</span>
              </button>
            ) : (
              <button type="button" className="btn-list btn" disabled={props.readonly} onClick={toggleEdit}>
                <i className="fas fa-pen"></i>
                <span className="ml-1">Edit</span>
              </button>
            )}

            <button
              type="button"
              className="btn-list btn ml-2"
              disabled={props.readonly}
              onClick={props.onQuestionDelete}
            >
              <i className="fas fa-times"></i>
              <span className="ml-1">Delete</span>
            </button>
          </div>
        </div>

        <div className="question-item__layout__answers">{renderedAnswers}</div>
      </div>
    </div>
  )
}

export default PollQuestion
