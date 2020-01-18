import React from 'react'
import { Link } from 'react-router-dom'
import { PollTemplateItemType } from '#/store/types'
import Loader from '#/components/Loader'
import Checkbox from '#/components/Checkbox'

interface PollTemplateItemProps {
  item: PollTemplateItemType
  pollDeleting: boolean
  pollEditing: boolean
  selected: boolean
  deletePoll: () => void
  navigateToPoll: () => void
  editPoll: () => void
  selectPoll: () => void
}

const PollTemplateItem = (props: PollTemplateItemProps) => {
  return (
    <div className="templates-list__item">
      <div className="templates-list__item__selection">
        <Checkbox checked={props.selected} toggle={props.selectPoll} />
      </div>

      <div className="templates-list__item__naming">
        <div className="templates-list__item__general">
          <div className="templates-list__item__general__name">{props.item.name}</div>
          <div className="templates-list__item__general__info">
            {/* <div className="templates-list__item__general__info__questions"></div>

            <div className="templates-list__item__general__info__votes">
              <i className="fas fa-eye"></i>
              <span className="ml-2">63</span>
            </div> */}
          </div>
        </div>

        <div className="templates-list__item__info">
          <div className="templates-list__item__info__launched">
            <div className="templates-list__item__info__caption">Launched</div>
            <div className="templates-list__item__info__title">{props.item.launchedCount} times</div>
          </div>
          <div className="templates-list__item__info__date">
            <div className="templates-list__item__info__caption">Created</div>
            <div className="templates-list__item__info__title">06 March 2019</div>
          </div>
        </div>

        <div className="templates-list__item__actions">
          <div className="templates-list__item__actions__action">
            <button className="btn btn-primary btn-not-rounded" onClick={props.editPoll} disabled={props.pollEditing}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
          <div className="templates-list__item__actions__action">
            <button className="btn btn-danger btn-not-rounded" onClick={props.deletePoll} disabled={props.pollDeleting}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="templates-list__item__actions__action">
            <button className="btn btn-success btn-not-rounded" onClick={props.navigateToPoll}>
              <i className="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollTemplateItem
