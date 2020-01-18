import React from 'react'
import { Modal, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from 'reactstrap'
import { ResponsiveContainer, BarChart, Tooltip, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import { generateChartBarColor } from '#/utils/functions'
import { PollHistoryRecordedQuestions } from '#/store/types'
import _ from 'lodash'

const PollHistoryChartPagination = (props: {
  selectQuestion: (index: number) => void
  currentQuestionIndex: number
  questionCount: number
}) => {
  const { selectQuestion, currentQuestionIndex, questionCount } = props

  return (
    <Pagination aria-label="Poll history pagination">
      <PaginationItem>
        <PaginationLink
          previous
          onClick={() => selectQuestion(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        />
      </PaginationItem>
      {[...new Array(questionCount).keys()].map((questionIndex: number) => (
        <PaginationItem key={questionIndex} active={questionIndex === currentQuestionIndex}>
          <PaginationLink
            onClick={() => selectQuestion(questionIndex)}
            disabled={questionIndex === currentQuestionIndex}
          >
            {questionIndex + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationLink
          next
          onClick={() => selectQuestion(currentQuestionIndex + 1)}
          disabled={questionCount === currentQuestionIndex + 1}
        />
      </PaginationItem>
    </Pagination>
  )
}

const PollHistoryModal = (props: { isOpen: boolean; toggleModal: () => void; data: PollHistoryRecordedQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0)
  const currentQuestion = props.data[currentQuestionIndex]
  const questionCount = props.data.length

  const selectQuestion = (index: number) => setCurrentQuestionIndex(index)

  const chartData = React.useMemo(
    () =>
      currentQuestion
        ? currentQuestion.recordedData.map((answer: { aid: number; answer: string; count: number }) => ({
            name: answer.answer,
            answers: answer.count
          }))
        : [],
    [currentQuestion]
  )

  const closeModal = () => {
    setCurrentQuestionIndex(0)
    props.toggleModal()
  }

  return (
    <Modal size="lg" isOpen={props.isOpen} toggle={closeModal} contentClassName="alert alert-primary">
      <ModalBody>
        <div className="row-columns row-columns__centered">
          <div className="column-responsive">
            <PollHistoryChartPagination
              questionCount={questionCount}
              selectQuestion={selectQuestion}
              currentQuestionIndex={currentQuestionIndex}
            />
          </div>
        </div>

        {currentQuestion !== undefined && (
          <>
            <h5 className="text-center mt-3">{currentQuestion.question}</h5>

            <ResponsiveContainer width={'100%'} height={500}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="answers" fill={generateChartBarColor(currentQuestionIndex)} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-secondary" type="button" onClick={closeModal}>
          Close
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default PollHistoryModal
