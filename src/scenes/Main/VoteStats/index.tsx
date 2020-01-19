import React from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { AnswerOption, AnswerSignature } from '#/store/types'
import { generateChartBarColor } from '#/utils/functions'

interface VoteStatsProps {
  currentIndex: number
  questionCount: number
  currentAnswers: Array<AnswerSignature>
  selectQuestion: (index: number) => void
  closeVote: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  question: string
  answers: Array<AnswerOption>
  openShareModal: () => void
}

interface VoteStatsState {
  width: number
  height: number
}

class VoteStats extends React.Component<VoteStatsProps, VoteStatsState> {
  constructor(props: VoteStatsProps) {
    super(props)
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  nextQuestion = (event: KeyboardEvent) => {
    if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
      this.props.selectQuestion(this.props.currentIndex + 1)
    } else if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
      this.props.selectQuestion(this.props.currentIndex - 1)
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions)
    window.addEventListener('keydown', this.nextQuestion)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
    window.removeEventListener('keydown', this.nextQuestion)
  }

  getPagination = () => {
    return (
      <Pagination aria-label="Page navigation example">
        <PaginationItem>
          <PaginationLink
            previous
            onClick={() => this.props.selectQuestion(this.props.currentIndex - 1)}
            disabled={this.props.currentIndex === 0}
          />
        </PaginationItem>
        {[...new Array(this.props.questionCount).keys()].map((questionIndex: number) => (
          <PaginationItem key={questionIndex} active={questionIndex === this.props.currentIndex}>
            <PaginationLink
              onClick={() => this.props.selectQuestion(questionIndex)}
              disabled={questionIndex === this.props.currentIndex}
            >
              {questionIndex + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink
            next
            onClick={() => this.props.selectQuestion(this.props.currentIndex + 1)}
            disabled={this.props.questionCount === this.props.currentIndex + 1}
          />
        </PaginationItem>
      </Pagination>
    )
  }

  render() {
    const aidToTitle: Record<number, string> = this.props.answers.reduce(
      (acc: Record<number, string>, answer: AnswerOption) => ({
        ...acc,
        [answer.id.toString()]: answer.answer
      }),
      {}
    )

    const chartData = this.props.currentAnswers.map((answerSig: AnswerSignature) => ({
      name: aidToTitle[answerSig.aid],
      answers: answerSig.count
    }))

    const chartHeight = this.state.height * 0.4

    return (
      <>
        <div className="row-columns row-columns__centered">
          <div className="column-responsive">{this.getPagination()}</div>
        </div>

        <br />
        <h5 className="text-center">{this.props.question}</h5>

        <ResponsiveContainer width={'100%'} height={chartHeight}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis type="number" allowDecimals={true} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="answers" fill={generateChartBarColor(this.props.currentIndex)} />

            {chartData.map((chartItem: { name: string; answers: number }) => (
              <ReferenceLine y={chartItem.name} label={chartItem.name} stroke="transparent" isFront={true} />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <div className="row-columns row-columns__centered mt-4">
          <button className="btn btn-danger float-right" onClick={this.props.closeVote}>
            Close poll
          </button>
          <button className="btn btn-primary ml-4" onClick={this.props.openShareModal}>
            Share poll
          </button>
        </div>
      </>
    )
  }
}

export default VoteStats
