import React from 'react'
import PollQuestion from '../PollQuestion'
import { QuestionContainer, QuestionAnswerHash, QuestionHash } from '#/store/types'

interface PollQuestionBareProps {
  container: QuestionContainer
  onQuestionCreate: () => void
  onQuestionDelete: (hash: QuestionHash) => void
  onQuestionChange: (hash: QuestionHash, value: string) => void
  onAnswerCreate: (hash: QuestionHash) => void
  onAnswerDelete: (hash: QuestionHash, answerHash: QuestionAnswerHash) => void
  onAnswerChange: (hash: QuestionHash, answerHash: QuestionAnswerHash, nextValue: string) => void
}

const PollQuestionBare = (props: PollQuestionBareProps) => {
  const renderQuestions = () => {
    const questions = Object.keys(props.container)
    if (questions.length) {
      return questions.map((questionHash: QuestionHash, index: number) => {
        const question = props.container[questionHash]
        return (
          <PollQuestion
            key={`q${index}`}
            hash={questionHash}
            question={question}
            onQuestionDelete={() => props.onQuestionDelete(questionHash)}
            onQuestionChange={(value: string) => props.onQuestionChange(questionHash, value)}
            onAnswerChange={(answerHash: QuestionAnswerHash, value: string) =>
              props.onAnswerChange(questionHash, answerHash, value)
            }
            onAnswerCreate={() => props.onAnswerCreate(questionHash)}
            onAnswerDelete={(answerHash: QuestionAnswerHash) => props.onAnswerDelete(questionHash, answerHash)}
          />
        )
      })
    }
    return 'No questions created'
  }

  return (
    <div className="box box-bordered mt-2">
      <div className="box__header d-flex justify-content-between align-items-center">
        <div>Questions & Answers</div>
        <div>
          <button type="button" className="btn btn-primary" onClick={props.onQuestionCreate}>
            <i className="fas fa-plus"></i>
            <span className="ml-1">Create</span>
          </button>
        </div>
      </div>

      <div className="box__body">{renderQuestions()}</div>
    </div>
  )
}

export default PollQuestionBare
