import React from 'react'
import ReactDOM from 'react-dom/client'
import Entry from './Entry'
import './index.css'

// Just for demo
const Frame = ({children}: React.PropsWithChildren<{}>) => {
  return <div className='h-[640px] w-[380px] bg-white'>{children}</div>
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Frame>
      <Entry />
    </Frame>
  </React.StrictMode>
)
