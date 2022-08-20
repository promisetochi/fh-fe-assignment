import React from "react"
import { useInitRooms } from "../../core/modules/rooms/hooks"
import Configurator from "./Configurator"
import Header from "./Header"
import SubmitButton from "./SubmitButton"

export const Rooms = () => {
  return (
    <div className="h-full flex flex-col text-sm overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Configurator />
      </div>
      <div className="px-6 pb-7 pt-6">
        <SubmitButton />
      </div>
    </div>
  )
}

export default () => {
  useInitRooms()
  return <Rooms />
}
