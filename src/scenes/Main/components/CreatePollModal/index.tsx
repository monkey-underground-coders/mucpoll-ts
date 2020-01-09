import React, { FormEvent, ChangeEvent } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup } from 'reactstrap'
import { connect } from 'react-redux'
import { createPoll } from '#/store/actions/poll'

interface CreatePollModalProps {
  isOpen: boolean
  toggleModal: any
  createPoll: (name: string) => Promise<any>
}

const CreatePollModal = (props: CreatePollModalProps) => {
  const [pollTitle, setPollTitle] = React.useState('')

  const createPoll = (evt: FormEvent) => {
    evt.preventDefault()

    if (pollTitle) {
      props.createPoll(pollTitle).then(() => {
        props.toggleModal()
      })
    }
  }

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPollTitle(e.target.value)
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggleModal} contentClassName="alert alert-primary">
      <ModalHeader toggle={props.toggleModal}>Create new Poll</ModalHeader>
      <form onSubmit={createPoll}>
        <ModalBody>
          <FormGroup>
            <label>Poll Title</label>
            <input
              type="text"
              className="form-control"
              value={pollTitle}
              onChange={onTitleChange}
              placeholder="Poll"
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Create
          </Button>
          <Button color="secondary" className="ml-2" onClick={props.toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default connect(null, { createPoll })(CreatePollModal)
