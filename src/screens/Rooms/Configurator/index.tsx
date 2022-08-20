import React from "react"
import { useDispatch } from "react-redux"
import { useRooms } from "../../../core/modules/rooms/hooks"
import { removeRoom } from "../../../core/modules/rooms/slice"
import { Rooms } from "../../../lib/RoomsLexer"
import Room from "../Room"
import AddRoomButton from "./AddRoomButton"

type Props = {
  rooms: Rooms
}

const Configurator = ({ rooms }: Props) => {
  const dispatch = useDispatch()
  return (
    <div className="h-full px-6">
      <div className="mb-4">
        {rooms.configuration.map(({ configuration }, index) => {
          return (
            <Room
              key={index}
              name={`Room ${index + 1}`}
              configuration={configuration}
              index={index}
              remove={
                index > 0
                  ? () => {
                      dispatch(removeRoom({ index }))
                    }
                  : undefined
              }
            />
          )
        })}
      </div>
      <AddRoomButton />
    </div>
  )
}

export default () => {
  const rooms = useRooms()
  return <Configurator rooms={rooms} />
}
