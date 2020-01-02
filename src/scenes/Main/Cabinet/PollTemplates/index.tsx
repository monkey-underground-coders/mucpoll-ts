import React from 'react'
import PollTemplateItem from '../../components/PollTemplateItem'
import { PollTemplateItemType, StoreRootState } from '#/store/types'
import { getPolls } from '#/store/actions/poll'
import './index.scss'
import { connect } from 'react-redux'

interface PollTemplatesProps {
  polls: Array<PollTemplateItemType>
  getPolls: () => Promise<any>
}

const PollTemplates = (props: PollTemplatesProps) => {
  React.useEffect(() => {
    props.getPolls()
  }, [])

  const renderedPolls = props.polls.map((poll: PollTemplateItemType) => (
    <PollTemplateItem key={poll.id} questions={poll.questions} name={poll.name} id={poll.id} creator={poll.creator} />
  ))

  return (
    <div className="templates-list">
      <div className="templates-list__inner">{renderedPolls}</div>
    </div>
  )
}

export default connect((store: StoreRootState) => ({ polls: store.poll.polls }), { getPolls })(PollTemplates)
