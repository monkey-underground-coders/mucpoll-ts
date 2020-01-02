import React from 'react'
import PollTemplateItem from './PollTemplateItem'
import './index.scss'
import apiRoutes from '#/agent/api'
import { getRequest } from '#/agent'
import { PollTemplateItemType } from '#/store/types'

interface PollTemplatesProps {}

const PollTemplates = (props: PollTemplatesProps) => {
  const [polls, setPolls] = React.useState([])

  const getPolls = () => getRequest(apiRoutes.getPolls)
  React.useEffect(() => {
    getPolls().then((json: any) => {
      setPolls(json)
    })
  }, [])

  const renderedPolls = polls.map((poll: PollTemplateItemType) => (
    <PollTemplateItem key={poll.id} questions={poll.questions} name={poll.name} id={poll.id} creator={poll.creator} />
  ))

  return (
    <div className="templates-list">
      <div className="templates-list__inner">{renderedPolls}</div>
    </div>
  )
}

export default PollTemplates
