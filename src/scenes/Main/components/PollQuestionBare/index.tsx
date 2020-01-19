import React from 'react'
import PollQuestion from '../PollQuestion'
import { QuestionContainer, QuestionAnswerHash, QuestionHash } from '#/store/types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface PollQuestionBareProps {
  container: QuestionContainer
  onQuestionCreate: () => void
  onQuestionDelete: (hash: QuestionHash) => void
  onQuestionChange: (hash: QuestionHash, value: string) => void
  toggleQuestionEditMode: (hash: QuestionHash) => void
  onAnswerCreate: (hash: QuestionHash) => void
  onAnswerDelete: (hash: QuestionHash, answerHash: QuestionAnswerHash) => void
  onAnswerChange: (hash: QuestionHash, answerHash: QuestionAnswerHash, nextValue: string) => void
  onDragEnd: (result: any) => void
}

const PollQuestionBare = (props: PollQuestionBareProps) => {
  const { container } = props
  const questionsList = React.useMemo(() => Object.keys(container), [container])
  const renderedQuestions = React.useMemo(() => {
    if (questionsList.length) {
      return questionsList.map((questionHash: QuestionHash, index: number) => {
        const questionClassName = ['question-item', index === 0 ? 'question-item__first' : ''].join(' ')
        const question = container[questionHash]
        return (
          <Draggable draggableId={questionHash as string} index={index} key={questionHash}>
            {provided => (
              <div
                className={questionClassName}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <PollQuestion
                  key={`q${index}`}
                  hash={questionHash}
                  question={question}
                  onQuestionCreate={props.onQuestionCreate}
                  onQuestionDelete={() => props.onQuestionDelete(questionHash)}
                  onQuestionChange={(value: string) => props.onQuestionChange(questionHash, value)}
                  onAnswerChange={(answerHash: QuestionAnswerHash, value: string) =>
                    props.onAnswerChange(questionHash, answerHash, value)
                  }
                  onAnswerCreate={() => props.onAnswerCreate(questionHash)}
                  onAnswerDelete={(answerHash: QuestionAnswerHash) => props.onAnswerDelete(questionHash, answerHash)}
                  toggleQuestionEditMode={() => props.toggleQuestionEditMode(questionHash)}
                />
              </div>
            )}
          </Draggable>
        )
      })
    }
    return 'No questions created'
  }, [
    questionsList,
    container,
    props.onQuestionChange,
    props.onQuestionCreate,
    props.onQuestionDelete,
    props.onAnswerChange,
    props.onAnswerCreate,
    props.onAnswerDelete,
    props.toggleQuestionEditMode
  ])

  return (
    <div className="box box-bordered mt-2">
      <div className="box__header d-flex justify-content-between align-items-center">
        <div>Questions & Answers</div>
        <div>
          <button type="button" className="btn btn-primary" onClick={props.onQuestionCreate}>
            <i className="fas fa-plus"></i>
            <span className="ml-1">Question</span>
          </button>
        </div>
      </div>

      <div className="box__body">
        <div>
          <DragDropContext onDragEnd={props.onDragEnd}>
            <Droppable droppableId="list">
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {renderedQuestions}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {!!questionsList.length && (
          <div className="mt-4">
            <div className="text-muted small">
              <div>Shortcuts:</div>
              <div>
                <b>Enter</b>: Create next answer
              </div>
              <div>
                <b>Shift + Enter</b>: Create next question
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PollQuestionBare
