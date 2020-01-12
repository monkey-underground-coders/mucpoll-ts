import React from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { AnswerOption, AnswerSignature } from '#/store/types'

interface VoteStatsProps {
  currentIndex: number
  questionCount: number
  currentAnswers: Array<AnswerSignature>
  selectQuestion: (index: number) => void
  closeVote: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  question: string
  answers: Array<AnswerOption>
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
          <PaginationLink previous onClick={() => this.props.selectQuestion(this.props.currentIndex - 1)} />
        </PaginationItem>
        {[...new Array(this.props.questionCount).keys()].map((questionIndex: number) => (
          <PaginationItem>
            <PaginationLink onClick={() => this.props.selectQuestion(questionIndex)}>
              {questionIndex + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink next onClick={() => this.props.selectQuestion(this.props.currentIndex + 1)} />
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

    const chartWidth = this.state.width * 0.8
    const chartHeight = this.state.height * 0.8

    return (
      <div>
        <div className="row">
          <div className="col-12">{this.getPagination()}</div>
          <div className="col-12">
            <button className="btn btn-danger float-right" onClick={this.props.closeVote}>
              Close poll
            </button>
          </div>
        </div>

        <br />
        <p className="text-center">{this.props.question}</p>

        <BarChart width={chartWidth} height={chartHeight} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="answers" fill="#8884d8" />
        </BarChart>
      </div>
    )
  }
}

export default VoteStats
