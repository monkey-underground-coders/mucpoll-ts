import React from 'react'
import ReactDOM from 'react-dom'
import Application from '#/components/Application'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import '#/styles/global.scss'

const wrapper = document.getElementById('root')
const rootElement = <Application />

ReactDOM.render(rootElement, wrapper)

serviceWorker.unregister()
