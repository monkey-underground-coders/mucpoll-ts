import React from 'react'
import { RouteComponentProps } from 'react-router'

interface CabinetProps extends RouteComponentProps {}

const Cabinet = (props: CabinetProps) => {
  const { match } = props

  return (
    <div className="cabinet">
      <div className="cabinet__inner">
        <span className="text-subtitle">My voting templates</span>
        <div className="cabinet-items">
          <div className="cabinet-items__inner">
            <div className="cabinet-item col-md-3 col-lg-4 col-12">

            </div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
            <div className="cabinet-item col-md-3 col-lg-4 col-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cabinet
