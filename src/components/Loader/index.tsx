import React from 'react'
import loader from '#/assets/img/login-spinner.svg'

const Loader = () => (
  <div className="d-flex flex-column justify-content-center align-items-center h-100">
    <div className="flex-vertically-centered py-4 text-center">
      <img src={loader} className="m-auto" alt="Loading Spinner" />
    </div>
  </div>
)

export default Loader
