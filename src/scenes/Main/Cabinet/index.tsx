import React from 'react'
import { RouteComponentProps } from 'react-router'
import './index.scss'
import PollTemplates from './PollTemplates'
import CreatePollModal from '../components/CreatePollModal'

interface CabinetProps extends RouteComponentProps {}

const Cabinet = (props: CabinetProps) => {
  const { match } = props
  const [isCreatePollModalOpen, setCreatePollModalOpen] = React.useState(false)

  const toggleModal = () => {
    setCreatePollModalOpen(!isCreatePollModalOpen)
  }

  return (
    <div className="cabinet">
      <div className="cabinet__inner">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-subtitle">My voting templates</div>
          <div>
            <button className="btn btn-primary" onClick={toggleModal}>
              <i className="fas fa-plus"></i> Create
            </button>
          </div>
        </div>
        <div className="cabinet-items">
          <div className="cabinet-items__inner">
            <PollTemplates />
          </div>
        </div>
      </div>

      <CreatePollModal isOpen={isCreatePollModalOpen} toggleModal={toggleModal} />
    </div>
  )
}

export default Cabinet
