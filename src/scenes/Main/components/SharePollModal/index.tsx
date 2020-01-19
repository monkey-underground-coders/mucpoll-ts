import React from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'

interface SharePollModal {
  toggle: () => void
  isOpen: boolean
  children: any
}

const SharePollModal = (props: SharePollModal) => {
  return (
    <Modal size="lg" isOpen={props.isOpen} toggle={props.toggle} contentClassName="alert alert-primary">
      <ModalBody>{props.children}</ModalBody>
      <ModalFooter>
        <button className="btn btn-primary ml-2" onClick={props.toggle}>
          Close
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default SharePollModal
