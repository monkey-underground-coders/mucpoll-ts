import React from 'react'

interface VotingTemplateItemProps {}

const VotingTemplateItem = (props: VotingTemplateItemProps) => {
  return (
    <tr>
      <td>
        <i className="far fa-circle"></i>
      </td>
      <td>What's the most popular programming language?</td>
      <td className="cabinet-items__table__tags">CODING, C++</td>
      <td>1 time</td>
      <td>March 31</td>
    </tr>
  )
}

export default VotingTemplateItem
