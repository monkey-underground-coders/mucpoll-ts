import React from 'react'
import VotingTemplateItem from './VotingTemplateItem'

interface VotingTemplatesProps {}

const VotingTemplates = (props: VotingTemplatesProps) => {
  return (
    <table className="table cabinet-items__table">
      <thead>
        <tr>
          <th></th>
          <th>TITLE</th>
          <th>TAGS</th>
          <th>LAUNCHED</th>
          <th>DATE</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(10).keys()].map((item: any) => (
          <VotingTemplateItem key={item} />
        ))}
      </tbody>
    </table>
  )
}

export default VotingTemplates
