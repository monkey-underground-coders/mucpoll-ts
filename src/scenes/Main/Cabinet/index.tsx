import React from 'react'
import { RouteComponentProps } from 'react-router'

interface CabinetProps extends RouteComponentProps {}

const Cabinet = (props: CabinetProps) => {
  const { match } = props

  return <div className="cabinet">Welcome to cabinet! :)</div>
}

export default Cabinet
