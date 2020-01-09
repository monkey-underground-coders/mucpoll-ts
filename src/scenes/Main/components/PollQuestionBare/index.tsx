import React from 'react'
import PollQuestion from '../PollQuestion'
import { QuestionContainer } from '#/store/types'

interface PollQuestionBareProps {
  container: QuestionContainer

  onQuestionCreate: any
  onQuestionDelete: any
  onQuestionChange: any
  onAnswerChange: any
  onAnswerCreate: any
  onAnswerDelete: any
}

const PollQuestionBare = (props: PollQuestionBareProps) => {
  const renderQuestions = () => {
    const questions = Object.keys(props.container)
    if (questions.length) {
      return questions.map((questionHash: string, index: number) => {
        const question = props.container[questionHash]
        return (
          <PollQuestion
            key={`q${index}`}
            hash={questionHash}
            question={question}
            onQuestionDelete={() => props.onQuestionDelete(questionHash)}
            onQuestionChange={(value: string) => props.onQuestionChange(questionHash, value)}
            onAnswerChange={(answerHash: string, value: string) =>
              props.onAnswerChange(questionHash, answerHash, value)
            }
            onAnswerCreate={() => props.onAnswerCreate(questionHash)}
            onAnswerDelete={(answerHash: string) => props.onAnswerDelete(questionHash, answerHash)}
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
