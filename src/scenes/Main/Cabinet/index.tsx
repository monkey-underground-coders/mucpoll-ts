import React from 'react'
import { RouteComponentProps } from 'react-router'
import PollTemplates from './PollTemplates'
import CreatePollModal from '../components/CreatePollModal'
import AnimatedPageTransition from '#/components/AnimatedPageTransition'
import './index.scss'

interface CabinetProps extends RouteComponentProps {}

const Cabinet = (props: CabinetProps) => {
  const [isCreatePollModalOpen, setCreatePollModalOpen] = React.useState<boolean>(false)

  const toggleModal = () => {
    setCreatePollModalOpen(!isCreatePollModalOpen)
  }

  return (
    <AnimatedPageTransition>
      <div className="cabinet">
        <div className="cabinet__inner">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-subtitle">My voting templates</div>
            <div>
              <button className="btn btn-primary" onClick={toggleModal}>
                <i className="fas fa-plus-circle"></i>
                <span className="ml-1">New Poll</span>
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
    </AnimatedPageTransition>
  )
}

export default Cabinet
