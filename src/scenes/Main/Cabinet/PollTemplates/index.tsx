import React from 'react'
import PollTemplateItem from '../../components/PollTemplateItem'
import { PollTemplateItemType, StoreRootState, Polls } from '#/store/types'
import { getPolls, deletePoll, deletePolls } from '#/store/actions/poll'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import Loader from '#/components/Loader'
import EditPollModal from '../../components/EditPollModal'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import './index.scss'

interface PollTemplatesProps extends RouteComponentProps {
  polls: Polls
  pollsLoading: boolean
  pollsLoadingFailed: boolean
  pollsDeleting: boolean
  pollsDeletingFailed: boolean
  pollDeleting: boolean
  pollDeletingFailed: boolean
  pollEditing: boolean
  pollEditingFailed: boolean
  getPolls: (size: number, page: number) => Promise<any>
  deletePoll: (pid: number) => Promise<any>
  deletePolls: (pids: number[]) => Promise<any>
}

const TEMPLATES_SIZE = 10

const PollTemplates = (props: PollTemplatesProps) => {
  const [currentPage, setCurrentPage] = React.useState<number>(0)
  const [selectedPolls, setSelectedPolls] = React.useState<number[]>([])
  const [EditPollModalData, setEditPollModalData] = React.useState<{
    isOpen: boolean
    pid: number | null
  }>({ isOpen: false, pid: null })

  const getSpecifiedPagePolls = () => props.getPolls(TEMPLATES_SIZE, currentPage)

  React.useEffect(() => {
    getSpecifiedPagePolls()
  }, [currentPage])

  const navigateToPoll = (pollId: number) => {
    props.history.push(`/cabinet/poll/${pollId}`)
  }

  const togglePollSelected = (pid: number) => {
    if (selectedPolls.includes(pid)) {
      // If poll is already selected, unselect it
      setSelectedPolls(selectedPolls.filter((s: number) => s !== pid))
    } else {
      // Otherwise, add to selected
      setSelectedPolls([...selectedPolls, pid])
    }
  }

  const deleteSelectedPolls = () => {
    if (selectedPolls.length && !props.pollsDeleting) {
      props.deletePolls(selectedPolls).then(() => {
        setSelectedPolls([])
      })
    }
  }

  const polls = React.useMemo(() => Object.values(props.polls.content), [props.polls])

  const renderedPolls = polls.map((poll: PollTemplateItemType) => (
    <PollTemplateItem
      key={poll.id}
      item={poll}
      navigateToPoll={() => navigateToPoll(poll.id)}
      deletePoll={() => props.deletePoll(poll.id)}
      editPoll={() => setEditPollModalData({ isOpen: true, pid: poll.id })}
      pollDeleting={props.pollDeleting}
      pollEditing={props.pollEditing}
      selected={selectedPolls.includes(poll.id)}
      selectPoll={() => togglePollSelected(poll.id)}
    />
  ))

  return (
    <div className="templates-list">
      {props.pollsLoadingFailed ? (
        <h3>An error occured while getting poll templates... Please, restart the page</h3>
      ) : props.pollsLoading ? (
        <Loader />
      ) : (
        <>
          <div className="templates-list__inner">{renderedPolls}</div>

          <EditPollModal
            isOpen={EditPollModalData.isOpen}
            pid={EditPollModalData.pid}
            toggle={() => setEditPollModalData({ isOpen: false, pid: null })}
          />
        </>
      )}

      {props.polls.settings.totalPages !== undefined && (
        <div className="mt-4 flex-right">
          <Pagination aria-label="Poll templates pagination">
            <PaginationItem>
              <PaginationLink
                previous
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0 || props.pollsLoading}
              />
            </PaginationItem>
            {[...new Array(props.polls.settings.totalPages).keys()].map((page: number) => (
              <PaginationItem key={page} active={page === currentPage}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  disabled={page === currentPage || props.pollsLoading}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink
                next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={props.polls.settings.totalPages === currentPage + 1 || props.pollsLoading}
              />
            </PaginationItem>
          </Pagination>
        </div>
      )}

      <div className="animated-div text-right mt-2" style={{ opacity: selectedPolls.length ? 1 : 0 }}>
        <button className="btn btn-danger" onClick={deleteSelectedPolls} disabled={props.pollsDeleting}>
          {props.pollsDeleting ? (
            <Loader small={true} />
          ) : (
            <>
              <i className="fas fa-trash"></i>
              <span className="ml-2">Delete ({selectedPolls.length})</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    (store: StoreRootState) => ({
      polls: store.poll.polls,
      pollsLoading: store.poll.pollsLoading,
      pollsLoadingFailed: store.poll.pollsLoadingFailed,
      pollsDeleting: store.poll.pollsDeleting,
      pollsDeletingFailed: store.poll.pollsDeletingFailed,
      pollDeleting: store.poll.pollDeleting,
      pollDeletingFailed: store.poll.pollDeletingFailed,
      pollEditing: store.poll.pollEditing,
      pollEditingFailed: store.poll.pollEditingFailed
    }),
    { getPolls, deletePoll, deletePolls }
  )(PollTemplates)
)
