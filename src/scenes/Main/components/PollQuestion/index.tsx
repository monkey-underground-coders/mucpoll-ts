import React from 'react'
import { QuestionContainerItem, QuestionHash, QuestionAnswerHash } from '#/store/types'
import _ from 'lodash'
import './index.scss'

interface PollQuestionAnswerProps {
  answer: string
  hash: QuestionAnswerHash
  shouldFocusInputRightAway: boolean
  onDelete: () => void
  createNextAnswer: () => void
  createNextQuestion: () => void
  setShouldFocusInputRightAway: (arg: boolean) => void
  onChange: (hash: QuestionAnswerHash, value: string) => void
}

const PollQuestionAnswer = (props: PollQuestionAnswerProps) => {
  const _inputRef = React.useRef(null)
  const [editMode, setEditMode] = React.useState<Boolean>(true)

  React.useLayoutEffect(() => {
    if (props.shouldFocusInputRightAway && _inputRef.current) {
      ;(_inputRef.current as any).focus()
      props.setShouldFocusInputRightAway(false)
    }
  }, [props.shouldFocusInputRightAway])

  const toggleEdit = () => {
    !!props.answer && setEditMode(!editMode)
  }

  const changeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(props.hash, e.target.value)
  }

  const onAnswerInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      toggleEdit()

      if (event.shiftKey) {
        props.createNextQuestion()
      } else if (props.answer) {
        props.createNextAnswer()
        props.setShouldFocusInputRightAway(true)
      }
    }
  }

  return (
    <div className="question-item__layout__answers__item">
      <div>
        {editMode ? (
          <input
            type="text"
            className="form-control"
            value={props.answer}
            onChange={changeItem}
            onKeyPress={onAnswerInputKeyPress}
            placeholder="Answer"
            ref={_inputRef}
          />
        ) : (
          <span>{props.answer}</span>
        )}
      </div>

      <div>
        <button type="button" className="btn btn-list" onClick={toggleEdit}>
          {editMode ? <i className="fas fa-check"></i> : <i className="fas fa-pen"></i>}
        </button>
        <button type="button" className="btn btn-list ml-2" onClick={props.onDelete}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

interface PollQuestionProps extends React.ComponentProps<any> {
  hash: QuestionHash
  readonly?: boolean
  question: QuestionContainerItem
  onAnswerCreate: () => void
  onAnswerDelete: (answerHash: QuestionAnswerHash) => void
  onAnswerChange: (answerHash: QuestionAnswerHash, value: string) => void
  onQuestionCreate: () => void
  onQuestionDelete: () => void
  onQuestionChange: (value: string) => void
  toggleQuestionEditMode: () => void
}

const PollQuestion = React.forwardRef((props: PollQuestionProps, ref) => {
  const [shouldFocusNextAnswerInputRightAway, setShouldFocusNextAnswerInputRightAway] = React.useState<boolean>(false)
  const { title, answers, editMode } = props.question

  const toggleEdit = () => {
    if (title) props.toggleQuestionEditMode()
  }

  const onQuestionInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && title) {
      props.onAnswerCreate()
      setShouldFocusNextAnswerInputRightAway(true)
    }
  }

  const _answers = React.useMemo(() => Object.keys(answers), [answers])
  const _renderedAnswers = React.useMemo(
    () =>
      _answers.map((hash: string, index: number) => {
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
                createNextAnswer={props.onAnswerCreate}
                createNextQuestion={props.onQuestionCreate}
                answer={answer}
                shouldFocusInputRightAway={shouldFocusNextAnswerInputRightAway}
                setShouldFocusInputRightAway={setShouldFocusNextAnswerInputRightAway}
              />
            </div>
          </div>
        )
      }),
    [_answers, props.onAnswerCreate, props.onQuestionCreate, props.onAnswerDelete, props.onAnswerChange]
  )

  const renderedTitle = editMode ? (
    <input
      type="text"
      placeholder="Question title"
      className="form-control w-100"
      value={title}
      onChange={e => props.onQuestionChange(e.target.value)}
      onKeyPress={onQuestionInputKeyPress}
      autoFocus
      required
    />
  ) : (
    <span>{title}</span>
  )

  return (
    <div>
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
              <span className="ml-1">Answer</span>
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

        <div className="question-item__layout__answers">{_renderedAnswers}</div>
      </div>
    </div>
  )
})

export default PollQuestion
