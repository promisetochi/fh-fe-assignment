import React from 'react'
import Rooms from "./screens/Rooms"
import { Provider } from 'react-redux'
import { createStore } from './core/redux/store'
import {BrowserRouter} from 'react-router-dom'

const Entry = () => {
  const store = createStore({})
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Rooms />
      </Provider>
    </BrowserRouter>
  )
}

export default Entry