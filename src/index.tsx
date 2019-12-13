import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './global.scss'

const wrapper = document.getElementById('root')
const rootElement = <App />

ReactDOM.render(rootElement, wrapper)

serviceWorker.unregister()
