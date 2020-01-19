import React from 'react'
import { AnswerOption } from '#/store/types'
import { Progress } from 'reactstrap'
import Checkbox from '#/components/Checkbox'
import './index.scss'
import AnimatedPageTransition from '#/components/AnimatedPageTransition'
import { generateChartBarColor } from '#/utils/functions'

interface VoteBoardProps {
  mayVote: boolean
  votingHistory: Record<number, number>
  qid: number
  question: string
  answers: Array<AnswerOption>
  answersResult: Array<{ aid: number; count: number }>
  answersResultCount: number
  voteMethod: (qid: number, answerId: number) => void
}

const progressBarClassNames = ['pb-custom-1', 'pb-custom-6', 'pb-custom-2', 'pb-custom-3', 'pb-custom-5', 'pb-custom-4']

const generateProgressBarColor = (index: number) => progressBarClassNames[index % progressBarClassNames.length]

const VoteBoard = (props: VoteBoardProps) => {
  const { mayVote, votingHistory } = props
  const votedOn = votingHistory[props.qid]

  return (
    <AnimatedPageTransition>
      <div className="box voteboard-item">
        <div className="box__header">{props.question}</div>
        <div className="box__body">
          {props.answers.map((a, index) => {
            const answerResult = props.answersResult.find((ans: { aid: number; count: number }) => ans.aid === a.id)
            return (
              <div key={`${a.answer}${index}`} className="form-group">
                <AnimatedPageTransition className="flex-vertically-centered w-100">
                  <>
                    {mayVote ? (
                      <Checkbox
                        value={a.answer}
                        label={a.answer}
                        checked={votedOn === a.id}
                        disabled={!mayVote}
                        labelKey={`vote${a.id}`}
                        toggle={() => props.voteMethod(props.qid, a.id)}
                      />
                    ) : (
                      answerResult && (
                        <AnimatedPageTransition className="flex-vertically-centered w-100">
                          <div className="w-100">
                            <div>{a.answer}</div>

                            <Progress
                              color={generateProgressBarColor(index)}
                              className="mt-1 w-100"
                              value={answerResult.count}
                              max={props.answersResultCount}
                            >
                              {Math.floor((answerResult.count / props.answersResultCount) * 100)}% ({answerResult.count}
                              )
                            </Progress>
                          </div>
                        </AnimatedPageTransition>
                      )
                    )}
                  </>
                </AnimatedPageTransition>
              </div>
            )
          })}
        </div>
      </div>
    </AnimatedPageTransition>
  )
}

export default VoteBoard
