import React from 'react'
import { RouteComponentProps } from 'react-router'
import apiRoutes from '#/agent/api'
import { getRequest } from '#/agent'
import { Link } from 'react-router-dom'
import Loader from '#/components/Loader'
import { parseDate } from '#/utils/functions'
import _ from 'lodash'
import './index.scss'
import PollHistoryModal from '../components/PollHistoryModal'
import { PollHistoryItem, PollHistoryRecordedQuestions } from '#/store/types'
import AnimatedPageTransition from '#/components/AnimatedPageTransition'

interface PollHistoryProps extends RouteComponentProps<{ id: string | undefined }> {}

const PollHistory = (props: PollHistoryProps) => {
  const [pollHistoryData, setPollHistoryData] = React.useState<PollHistoryItem[]>([])
  const [pollHistoryLoading, setPollHistoryLoading] = React.useState<boolean>(false)
  const [pollHistoryLoadingFailed, setPollHistoryLoadingFailed] = React.useState<boolean>(false)
  const [currentPollChartModalData, setCurrentPollChartModalData] = React.useState<{
    isOpen: boolean
    data: PollHistoryRecordedQuestions
  }>({ isOpen: false, data: [] })

  React.useEffect(() => {
    const { id } = props.match.params
    if (id) {
      setPollHistoryLoading(true)
      getRequest(apiRoutes.pollHistory(parseInt(id)))
        .then((json: any) => {
          setPollHistoryData(json)
          setPollHistoryLoading(false)
        })
        .catch(err => {
          console.warn(err)
          setPollHistoryLoading(true)
          setPollHistoryLoadingFailed(true)
        })
    }
  }, [])

  const showChartData = (index: number) => {
    const currentChartData = pollHistoryData[index].recordedQuestions
    if (currentChartData.length) {
      setCurrentPollChartModalData({ isOpen: true, data: currentChartData })
    }
  }

  const closeChartModal = () => {
    if (currentPollChartModalData.isOpen) {
      setCurrentPollChartModalData({ isOpen: false, data: [] })
    }
  }

  const _pollTitle = pollHistoryData.length ? pollHistoryData[0].pollInfo.name : null
  const _pollHistoryItems = React.useMemo(
    () =>
      pollHistoryData.map(pollHistoryItem => ({
        questions: pollHistoryItem.recordedQuestions,
        startedAt: pollHistoryItem.startedAt,
        recordedAt: pollHistoryItem.recordedAt
      })),
    [pollHistoryData.length]
  )
  const _renderedHistoryItems = React.useMemo(
    () =>
      _pollHistoryItems.map((historyItem, index) => {
        const _answerCount = historyItem.questions.reduce((count: number, question: any) => {
          if (question.recordedData) {
            return (
              count + question.recordedData.reduce((_currCount: number, answer: any) => _currCount + answer.count, 0)
            )
          }
          return count
        }, 0)
        return (
          <tr className="poll-history-item" key={index}>
            <td className="poll-history-item__index">{index + 1}.</td>
            <td className="poll-history-item__date">
              {parseDate(historyItem.startedAt)} - {parseDate(historyItem.recordedAt)}
            </td>

            <td className="poll-history-item__count">{_answerCount} answers</td>
            <td className="poll-history-item__actions">
              <button className="btn btn-list" onClick={() => showChartData(index)}>
                <i className="fas fa-chart-bar"></i>
                <span className="ml-1">Show chart</span>
              </button>
            </td>
          </tr>
        )
      }),
    [_pollHistoryItems]
  )

  return (
    <AnimatedPageTransition>
      <div className="box">
        {!pollHistoryLoading && !_.isEmpty(pollHistoryData) && (
          <div className="box__header">
            <h5>History for {_pollTitle}</h5>
          </div>
        )}
        <div className="box__body">
          {!pollHistoryLoadingFailed ? (
            pollHistoryLoading || _.isEmpty(pollHistoryData) ? (
              <Loader />
            ) : (
              <div>
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Period</th>
                      <th>Answers count</th>
                      <th style={{ width: 140 }}></th>
                    </tr>
                  </thead>
                  <tbody>{_renderedHistoryItems}</tbody>
                </table>
              </div>
            )
          ) : (
            <h5 className="text-center">
              Loading failed... <Link to="/">Go to index</Link>
            </h5>
          )}

          <PollHistoryModal
            toggleModal={closeChartModal}
            data={currentPollChartModalData.data}
            isOpen={currentPollChartModalData.isOpen}
          />
        </div>
      </div>
    </AnimatedPageTransition>
  )
}

export default PollHistory
