import React from 'react'
import { RouteComponentProps } from 'react-router'
import './index.scss'
import VotingTemplates from './VotingTemplates'

interface CabinetProps extends RouteComponentProps {}

const Cabinet = (props: CabinetProps) => {
  const { match } = props

  return (
    <div className="cabinet">
      <div className="cabinet__inner">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-subtitle">My voting templates</div>
          <div>
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Create
            </button>
          </div>
        </div>
        <div className="cabinet-items">
          <div className="cabinet-items__inner">
            <VotingTemplates />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cabinet
