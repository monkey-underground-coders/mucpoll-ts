import React from 'react'
import { AnswerOption } from '#/store/types'

interface VoteBoardProps {
  mayVote: boolean
  votingHistory: Record<number, number>
  qid: number
  question: string
  answers: Array<AnswerOption>
  voteMethod: (qid: number, answerId: number) => void
}

const VoteBoard = (props: VoteBoardProps) => {
  const { mayVote, votingHistory } = props
  const votedOn = votingHistory[props.qid]

  return (
    <div className="box">
      <div className="box__header">{props.question}</div>
      <div className="box__body">
        {props.answers.map(a => (
          <div key={a.answer} className="form-group">
            <input
              type="checkbox"
              id={`vote${a.id}`}
              onChange={v => props.voteMethod(props.qid, a.id)}
              value={a.answer}
              checked={votedOn === a.id}
              disabled={!mayVote}
            />
            <label htmlFor={`vote${a.id}`}>{a.answer}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoteBoard
