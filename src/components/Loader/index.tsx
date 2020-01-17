import React from 'react'
import loader from '#/assets/img/login-spinner.svg'

const Loader = (props: { small?: boolean }) => {
  const loaderWrapperClassNames = ['flex-vertically-centered', 'text-center', !props.small ? 'py-4' : ''].join(' ')
  const loaderAdditionalProps = {
    ...(props.small ? { width: '20px' } : {})
  }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div className={loaderWrapperClassNames}>
        <img src={loader} className="m-auto" alt="Loading Spinner" {...loaderAdditionalProps} />
      </div>
    </div>
  )
}

export default Loader
