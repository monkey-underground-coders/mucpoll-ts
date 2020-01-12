import React from 'react'
import stomp from '#/utils/stomp'
import Websocket from 'react-websocket'
import QRCode from 'qrcode.react'
import { selfUrl, wsRoutes } from '#/agent/api'
import { getLocalStorageItem } from '#/utils/functions'
import VoteStats from '../VoteStats'
import { RouteComponentProps } from 'react-router'
import { Question, AnswerOption } from '#/store/types'

interface PollerProps extends RouteComponentProps<{ id: string | undefined }> {}

interface PollerState {
  exchangeStatus: number
  sid: string | number | null
  voteInfo: any | null
  voteId: string | undefined
}

enum ExchangeStatus {
  CONNECTING,
  OPENING_VOTE,
  GATHERING_INFO,
  SHOWING_LINK,
  ONLINE,
  CLOSED
}

const connectUrl = wsRoutes.poll

class Poller extends React.Component<PollerProps, PollerState> {
  wsRef: undefined | null | any
  transitions: Record<number, (data: string) => void> = {
    [ExchangeStatus.CONNECTING]: (data: string) => {
      this.stateConnecting()
    },
    [ExchangeStatus.OPENING_VOTE]: (data: string) => {
      this.stateOpeningVote(data)
    },
    [ExchangeStatus.GATHERING_INFO]: (data: string) => {
      this.stateGatheringInfo(data)
    },
    [ExchangeStatus.ONLINE]: (data: string) => {
      this.stateOnline(data)
    }
  }

  constructor(props: PollerProps) {
    super(props)
    this.state = {
      exchangeStatus: ExchangeStatus.CONNECTING,
      sid: null,
      voteInfo: null,
      voteId: props.match.params.id
    }
  }

  stateConnecting = () => {
    const { voteId } = this.state
    this.sendMessage(stomp.subscribe(`/topic/${voteId}`))
    this.sendMessage(stomp.send(`/app/polladmin/${voteId}/openvote`, ''))
    this.setState(() => ({ exchangeStatus: ExchangeStatus.OPENING_VOTE }))
  }

  stateOpeningVote = (msg: string) => {
    const { voteId } = this.state
    const decoded = stomp.getJson(msg)
    const sid = decoded.sid
    this.sendMessage(stomp.subscribe(`/topic/${voteId}/${sid}`))
    this.sendMessage(stomp.send(`/app/vote/${voteId}/${sid}/info`, ''))
    this.setState(() => ({
      sid: sid,
      exchangeStatus: ExchangeStatus.GATHERING_INFO
    }))
  }

  eventGoToOnline = (event: KeyboardEvent) => {
    if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
      this.goToOnline()
    }
  }

  stateGatheringInfo = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    if (!live) {
      this.setState(() => ({
        exchangeStatus: ExchangeStatus.CLOSED,
        voteInfo: decoded
      }))
      delete this.wsRef
      return
    }
    window.addEventListener('keydown', this.eventGoToOnline)
    this.setState(() => ({
      exchangeStatus: ExchangeStatus.SHOWING_LINK,
      voteInfo: decoded
    }))
  }

  stateOnline = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    if (!live) {
      this.setState(() => ({
        exchangeStatus: ExchangeStatus.CLOSED,
        voteInfo: decoded
      }))
      delete this.wsRef
      return
    }
    this.setState({
      exchangeStatus: ExchangeStatus.ONLINE,
      voteInfo: decoded
    })
  }

  onOpen = () => {
    const login = getLocalStorageItem('username')
    const password = getLocalStorageItem('password')
    this.setState(() => ({ exchangeStatus: ExchangeStatus.CONNECTING }))
    this.sendMessage(stomp.connect(connectUrl, login, password))
  }

  onClose = () => {
    console.log('WebSocket closed!')
  }

  handleData = (data: any) => {
    const { exchangeStatus } = this.state
    if (data === '\n') {
      this.sendMessage('\n')
    } else if (this.transitions.hasOwnProperty(exchangeStatus)) {
      this.transitions[exchangeStatus](data)
    }
  }

  sendMessage = (message: string) => {
    console.log(`Sending ${message}!`)
    this.wsRef.sendMessage(message)
  }

  changeQuestion = (toQid: string | undefined) => {
    const { voteId, sid } = this.state
    if (toQid !== undefined) {
      this.sendMessage(stomp.send(`/app/polladmin/${voteId}/${sid}/change_question`, JSON.stringify({ qid: toQid })))
    }
  }

  closeVote = () => {
    const { voteId, sid } = this.state
    this.sendMessage(stomp.send(`/app/polladmin/${voteId}/${sid}/stopvote`))
    this.setState({ exchangeStatus: ExchangeStatus.CLOSED })
  }

  goToOnline = () => {
    const { voteId, sid } = this.state
    this.sendMessage(stomp.send(`/app/polladmin/${voteId}/${sid}/start`))
    window.removeEventListener('keydown', this.eventGoToOnline)
    this.setState({ exchangeStatus: ExchangeStatus.ONLINE })
  }

  getWebSocketWrapper = () => {
    return (
      <Websocket
        onMessage={this.handleData}
        url={connectUrl}
        onOpen={this.onOpen}
        onClose={this.onClose}
        debug={true}
        ref={ws => (this.wsRef = ws)}
      />
    )
  }

  renderClosed = () => {
    return <div>VOTE CLOSED!</div>
  }

  renderOnline = () => {
    const { voteInfo } = this.state
    const currentQID: number = voteInfo.currentQid
    const currentQuestion: Question = voteInfo.pollInfo.questions.filter((q: any) => q.id === currentQID)[0]
    const questionTitle: string = currentQuestion.question
    const answerOptions: Array<AnswerOption> = currentQuestion.answerOptions
    const indexToQID: Record<number, number> = voteInfo.pollInfo.questions.reduce(
      (acc: Record<number, number>, question: any) => ({ ...acc, [question.index]: question.id }),
      {}
    )
    const currentIndex: number = currentQuestion.index
    const currentAnswers: Array<{ aid: number; count: number }> = voteInfo.answers
    return (
      <div>
        {this.getWebSocketWrapper()}
        <VoteStats
          question={questionTitle}
          answers={answerOptions}
          selectQuestion={(index: number) => this.changeQuestion(indexToQID[index].toString())}
          currentIndex={currentIndex}
          questionCount={voteInfo.pollInfo.questions.length}
          closeVote={this.closeVote}
          currentAnswers={currentAnswers}
        />
      </div>
    )
  }

  renderLink = () => {
    const { voteId, sid } = this.state
    const link = `${selfUrl}/voter/${voteId}/${sid}`
    return (
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        {this.getWebSocketWrapper()}
        <QRCode
          value={link}
          size={Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 0.8}
        />
        <p>
          <a href={link}>{link}</a>
        </p>
        <button className="btn btn-primary" onClick={this.goToOnline}>
          Start!
        </button>
      </div>
    )
  }

  renderLoading = () => {
    return (
      <div>
        {this.getWebSocketWrapper()}
        <div>Loading ...</div>
      </div>
    )
  }

  render() {
    const { exchangeStatus } = this.state
    if (exchangeStatus === ExchangeStatus.CLOSED) {
      return this.renderClosed()
    } else if (exchangeStatus === ExchangeStatus.ONLINE) {
      return this.renderOnline()
    } else if (exchangeStatus === ExchangeStatus.SHOWING_LINK) {
      return this.renderLink()
    } else {
      return this.renderLoading()
    }
  }
}

export default Poller