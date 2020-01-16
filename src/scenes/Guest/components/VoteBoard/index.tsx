import React from 'react'
import { AnswerOption } from '#/store/types'
import './index.scss'
import Checkbox from '#/components/Checkbox'

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
    <div className="box voteboard-item">
      <div className="box__header">{props.question}</div>
      <div className="box__body">
        {props.answers.map(a => (
          <div key={a.answer} className="form-group">
            <Checkbox
              value={a.answer}
              label={a.answer}
              checked={votedOn === a.id}
              disabled={!mayVote}
              labelKey={`vote${a.id}`}
              toggle={() => props.voteMethod(props.qid, a.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoteBoard
