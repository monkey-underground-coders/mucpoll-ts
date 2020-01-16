import React from 'react'
import PollTemplateItem from '../../components/PollTemplateItem'
import { PollTemplateItemType, StoreRootState } from '#/store/types'
import { getPolls } from '#/store/actions/poll'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import './index.scss'
import Loader from '#/components/Loader'

interface PollTemplatesProps extends RouteComponentProps {
  polls: Array<PollTemplateItemType>
  pollsLoading: boolean
  pollsLoadingFailed: boolean
  getPolls: () => Promise<any>
}

const PollTemplates = (props: PollTemplatesProps) => {
  React.useEffect(() => {
    props.getPolls()
  }, [])

  const navigateToPoll = (pollId: number) => {
    props.history.push(`/cabinet/poll/${pollId}`)
  }

  const polls = React.useMemo(() => Object.values(props.polls), [props.polls])

  const renderedPolls = polls.map((poll: PollTemplateItemType) => (
    <PollTemplateItem key={poll.id} item={poll} navigateToPoll={() => navigateToPoll(poll.id)} />
  ))

  return (
    <div className="templates-list">
      {props.pollsLoadingFailed ? (
        <h3>An error occured while getting poll templates... Please, restart the page</h3>
      ) : props.pollsLoading ? (
        <Loader />
      ) : (
        <div className="templates-list__inner">{renderedPolls}</div>
      )}
    </div>
  )
}

export default withRouter(
  connect(
    (store: StoreRootState) => ({
      polls: store.poll.polls,
      pollsLoading: store.poll.pollsLoading,
      pollsLoadingFailed: store.poll.pollsLoadingFailed
    }),
    { getPolls }
  )(PollTemplates)
)
