import React from 'react'
import PollTemplateItem from '../../components/PollTemplateItem'
import { PollTemplateItemType, StoreRootState } from '#/store/types'
import { getPolls, deletePoll, editPoll } from '#/store/actions/poll'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import './index.scss'
import Loader from '#/components/Loader'

interface PollTemplatesProps extends RouteComponentProps {
  polls: Pick<PollTemplateItemType[], number>
  pollsLoading: boolean
  pollsLoadingFailed: boolean
  pollDeleting: boolean
  pollDeletingFailed: boolean
  pollEditing: boolean
  pollEditingFailed: boolean
  getPolls: () => Promise<any>
  deletePoll: (pid: number) => Promise<any>
  editPoll: (pid: number, title: string) => Promise<any>
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
    <PollTemplateItem
      key={poll.id}
      item={poll}
      navigateToPoll={() => navigateToPoll(poll.id)}
      deletePoll={() => props.deletePoll(poll.id)}
      editPoll={props.editPoll}
      pollDeleting={props.pollDeleting}
      pollEditing={props.pollEditing}
    />
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
      pollsLoadingFailed: store.poll.pollsLoadingFailed,
      pollDeleting: store.poll.pollDeleting,
      pollDeletingFailed: store.poll.pollDeletingFailed,
      pollEditing: store.poll.pollEditing,
      pollEditingFailed: store.poll.pollEditingFailed
    }),
    { getPolls, deletePoll, editPoll }
  )(PollTemplates)
)
