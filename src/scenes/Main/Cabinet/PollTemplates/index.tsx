import React from 'react'
import PollTemplateItem from '../../components/PollTemplateItem'
import { PollTemplateItemType, StoreRootState } from '#/store/types'
import { getPolls } from '#/store/actions/poll'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import './index.scss'

interface PollTemplatesProps extends RouteComponentProps {
  polls: Array<PollTemplateItemType>
  getPolls: () => Promise<any>
}

const PollTemplates = (props: PollTemplatesProps) => {
  React.useEffect(() => {
    props.getPolls()
  }, [])

  const navigateToPoll = (pollId: number) => {
    props.history.push(`/cabinet/poll/${pollId}`)
  }

  const renderedPolls = props.polls.map((poll: PollTemplateItemType) => (
    <PollTemplateItem key={poll.id} item={poll} navigateToPoll={() => navigateToPoll(poll.id)} />
  ))

  return (
    <div className="templates-list">
      <div className="templates-list__inner">{renderedPolls}</div>
    </div>
  )
}

export default withRouter(
  connect((store: StoreRootState) => ({ polls: store.poll.polls }), { getPolls })(PollTemplates)
)
