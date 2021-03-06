import React from 'react'
import stomp from '#/utils/stomp'
import Websocket from 'react-websocket'
import { wsRoutes } from '#/agent/api'
import VoteBoard from '../components/VoteBoard'
import { RouteComponentProps } from 'react-router'
import { AnswerOption, Question } from '#/store/types'
import Loader from '#/components/Loader'
import { getCurrentSeconds } from '#/utils/functions'

interface VoterProps extends RouteComponentProps<{ voteId: string; voteUUID: string }> {
}

interface VoterState {
  exchangeStatus: number
  votedOn: any
  voteInfo: null | any
  voteUUID: string | number
  voteId: string | number
}

enum ExchangeStatusEnum {
  CONNECTING,
  GATHERING_INFO,
  AWAITING_START,
  ONLINE,
  CLOSED
}

const connectUrl = wsRoutes.poll

class Voter extends React.Component<VoterProps, VoterState> {
  wsRef: null | undefined | any
  transitions: Record<number, (data: string) => void> = {
    [ExchangeStatusEnum.CONNECTING]: (data: string) => {
      this.stateConnecting()
    },
    [ExchangeStatusEnum.GATHERING_INFO]: (data: string) => {
      this.stateGatheringInfo(data)
    },

    [ExchangeStatusEnum.AWAITING_START]: (data: string) => {
      this.stateAwaitingStart(data)
    },

    [ExchangeStatusEnum.ONLINE]: (data: string) => {
      this.stateOnline(data)
    }
  }
  lastWriteHeartbeat = getCurrentSeconds()

  constructor(props: VoterProps) {
    super(props)
    this.state = {
      votedOn: {},
      exchangeStatus: ExchangeStatusEnum.CONNECTING,
      voteInfo: null,
      voteUUID: props.match.params.voteUUID,
      voteId: parseInt(props.match.params.voteId)
    }
  }

  stateConnecting = () => {
    const { voteId, voteUUID } = this.state
    this.setState({ exchangeStatus: ExchangeStatusEnum.GATHERING_INFO })
    this.sendMessage(stomp.subscribe(`/topic/${voteId}/${voteUUID}`))
    this.sendMessage(stomp.send(`/app/vote/${voteId}/${voteUUID}/info`, ''))
  }

  stateGatheringInfo = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    this.setState(
      {
        exchangeStatus: !live
          ? ExchangeStatusEnum.CLOSED
          : decoded.started
            ? ExchangeStatusEnum.ONLINE
            : ExchangeStatusEnum.AWAITING_START,
        voteInfo: decoded
      },
      () => {
        !live && delete this.wsRef
      }
    )
  }

  stateAwaitingStart = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    this.setState(
      (prevState: VoterState) => ({
        exchangeStatus: !live
          ? ExchangeStatusEnum.CLOSED
          : decoded.started
            ? ExchangeStatusEnum.ONLINE
            : prevState.exchangeStatus,
        voteInfo: decoded
      }),
      () => {
        !live && delete this.wsRef
      }
    )
  }

  stateOnline = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    this.setState(
      {
        exchangeStatus: !live ? ExchangeStatusEnum.CLOSED : ExchangeStatusEnum.ONLINE,
        voteInfo: decoded
      },
      () => {
        !live && delete this.wsRef
      }
    )
  }

  onOpen = () => {
    console.log('WebSocket opened!')
    this.setState({ exchangeStatus: ExchangeStatusEnum.CONNECTING })
    this.sendMessage(stomp.connect(connectUrl))
  }

  onClose = () => {
    console.log('WebSocket closed!')
  }

  handleData = (data: any) => {
    const { exchangeStatus } = this.state
    if (data === '\n') {
      this.sendMessage('\n')
      return
    } else if ((
        this.state.exchangeStatus === ExchangeStatusEnum.ONLINE ||
        this.state.exchangeStatus === ExchangeStatusEnum.AWAITING_START
      ) &&
      getCurrentSeconds() - this.lastWriteHeartbeat > stomp.defaultWriteHeartbeatInterval) {
      this.sendMessage('\n')
      this.lastWriteHeartbeat = getCurrentSeconds()
    }

    if (this.transitions.hasOwnProperty(exchangeStatus)) {
      this.transitions[exchangeStatus](data)
    }
  }

  sendMessage = (message: string) => {
    console.log(`Sending ${message}!`)
    this.wsRef.sendMessage(message)
  }

  vote = (qid: number, aid: number) => {
    const { votedOn, voteId, voteUUID } = this.state
    const sqid = qid.toString()
    if (!(sqid in votedOn)) {
      this.sendMessage(stomp.send(`/app/vote/${voteId}/${voteUUID}/append`, JSON.stringify({ aid: aid })))
      this.setState(prevState => ({
        votedOn: { ...prevState.votedOn, [sqid]: aid }
      }))
    } else {
      console.warn('Double vote detected')
    }
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

  renderOnline = () => {
    const { voteInfo, votedOn } = this.state
    const currentQID: number = voteInfo.currentQid
    const currentQuestion: Question = voteInfo.pollInfo.questions.find((q: any) => q.id === currentQID)
    const questionTitle: string = currentQuestion.question
    const answerOptions: Array<AnswerOption> = currentQuestion.answerOptions
    const answersResultCount = voteInfo.answers.reduce((acc: number, answer: any) => acc + answer.count, 0)

    return (
      <>
        {this.getWebSocketWrapper()}
        <VoteBoard
          mayVote={!(currentQID.toString() in votedOn)}
          qid={currentQID}
          question={questionTitle}
          answers={answerOptions}
          answersResult={voteInfo.answers}
          answersResultCount={answersResultCount}
          voteMethod={this.vote}
          votingHistory={votedOn}
        />
      </>
    )
  }

  renderAwaitingStart = () => {
    return (
      <>
        {this.getWebSocketWrapper()}
        <h2 className="text-center">Waiting for the start</h2>
      </>
    )
  }

  renderLoading = () => {
    return (
      <>
        {this.getWebSocketWrapper()}
        <Loader/>
      </>
    )
  }

  render() {
    const { exchangeStatus } = this.state
    if (exchangeStatus === ExchangeStatusEnum.CLOSED) {
      return <h2 className="text-center">Poll has finished. Thank you!</h2>
    }

    if (exchangeStatus === ExchangeStatusEnum.ONLINE) {
      return this.renderOnline()
    } else if (exchangeStatus === ExchangeStatusEnum.AWAITING_START) {
      return this.renderAwaitingStart()
    } else {
      return this.renderLoading()
    }
  }
}

export default Voter
