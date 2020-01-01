import React from 'react'
import VotingTemplateItem from './VotingTemplateItem'
import './index.scss'

interface VotingTemplatesProps {}

const VotingTemplates = (props: VotingTemplatesProps) => {
  return (
    <div className="templates-list">
      <div className="templates-list__inner">
        {[...new Array(10).keys()].map((item: number) => (
          <VotingTemplateItem />
        ))}
      </div>
    </div>
  )
}

export default VotingTemplates
