import React from 'react'
import stomp from '#/utils/stomp'
import Websocket from 'react-websocket'
import QRCode from 'qrcode.react'
import { selfUrl, wsRoutes } from '#/agent/api'
import { getLocalStorageItem, copyToClipBoardEvent } from '#/utils/functions'
import VoteStats from '../VoteStats'
import { RouteComponentProps, withRouter } from 'react-router'
import { Question, AnswerOption } from '#/store/types'
import { UncontrolledPopover, PopoverBody } from 'reactstrap'
import Loader from '#/components/Loader'
import SharePollModal from '../components/SharePollModal'
import AnimatedPageTransition from '#/components/AnimatedPageTransition'

interface PollerProps extends RouteComponentProps<{ id: string | undefined }> {}

interface PollerState {
  exchangeStatus: number
  sid: string | number | null
  voteInfo: any | null
  voteId: string | undefined
  sharePollModalOpen: boolean
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
      sid: null,
      voteInfo: null,
      sharePollModalOpen: false,
      voteId: props.match.params.id,
      exchangeStatus: ExchangeStatus.CONNECTING
    }
  }

  toggleSharePollModalOpen = () =>
    this.setState((prevState: PollerState) => ({ sharePollModalOpen: !prevState.sharePollModalOpen }))

  componentWillUnmount() {
    if (this.state.exchangeStatus === ExchangeStatus.ONLINE) {
      this.closeVote()
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
    window.addEventListener('keydown', this.eventGoToOnline)
    if (live !== undefined) {
      this.setState(
        () => ({
          exchangeStatus: !live ? ExchangeStatus.CLOSED : ExchangeStatus.SHOWING_LINK,
          voteInfo: decoded
        }),
        () => {
          !live && delete this.wsRef
        }
      )
    }
  }

  stateOnline = (msg: string) => {
    const decoded = stomp.getJson(msg)
    const live = decoded.open
    if (live !== undefined) {
      this.setState(
        {
          exchangeStatus: !live ? ExchangeStatus.CLOSED : ExchangeStatus.ONLINE,
          voteInfo: decoded
        },
        () => {
          !live && delete this.wsRef
        }
      )
    }
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
    this.setState({ exchangeStatus: ExchangeStatus.CLOSED }, () => {
      this.props.history.push('/')
    })
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
      <AnimatedPageTransition>
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
            openShareModal={() => this.toggleSharePollModalOpen()}
          />
          <SharePollModal isOpen={this.state.sharePollModalOpen} toggle={() => this.toggleSharePollModalOpen()}>
            {this.getLinks()}
          </SharePollModal>
        </div>
      </AnimatedPageTransition>
    )
  }

  getLinks = () => {
    const { voteId, sid } = this.state
    const link = `${selfUrl}/guest/voter/${voteId}/${sid}`
    return (
      <AnimatedPageTransition>
        <>
          <QRCode
            value={link}
            size={Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 0.8}
          />
          <div className="my-2">
            <div>
              Share link:
              <button
                id="copyToClipboardLink"
                className="btn btn-link btn-text-link__big"
                onClick={e => copyToClipBoardEvent(e, link)}
              >
                <i className="far fa-copy"></i> {link}
              </button>
            </div>

            <UncontrolledPopover trigger="legacy" placement="top" target="#copyToClipboardLink">
              <PopoverBody>Copied to clipboard!</PopoverBody>
            </UncontrolledPopover>
          </div>
        </>
      </AnimatedPageTransition>
    )
  }

  renderLink = () => {
    return (
      <AnimatedPageTransition>
        <div className="text-center">
          {this.getWebSocketWrapper()}
          {this.getLinks()}

          <button className="btn btn-primary mt-3" onClick={this.goToOnline}>
            Start Poll
          </button>
        </div>
      </AnimatedPageTransition>
    )
  }

  renderLoading = () => {
    return (
      <AnimatedPageTransition>
        <div>
          {this.getWebSocketWrapper()}
          <Loader />
        </div>
      </AnimatedPageTransition>
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

export default withRouter(Poller)
