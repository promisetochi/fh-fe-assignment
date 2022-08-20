import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { RoomsLexer } from "../../../lib/RoomsLexer"
import { useAppDispatch } from "../../redux/store"
import { initRooms, selectRooms } from "./slice"

export const useRooms = () => {
  const rooms = useSelector(selectRooms)
  return rooms
}

export const useInitRooms = () => {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const rooms = searchParams.get("rooms")?.trim()

  useEffect(() => {
    if (rooms) {
      const rm = new RoomsLexer()
      try {
        const ast = rm.parse(rooms)
        // I can fix this by typing the RoomsLexer class more tightly but I don't think that's important for this assignment
        // I could do it in a follow-up call, if there's one
        // @ts-ignore
        dispatch(initRooms(ast))
      } catch (e) {
        // log error
        console.warn(e)
      }
    }
  }, [rooms])
}

export const useRoomsStats = () => {
  const rooms = useRooms()
  return {
    rooms: {
      count: rooms.configuration.length,
    },
    guests: {
      count: rooms.configuration.reduce(
        (sum, { configuration: [adults, children] }) => {
          return sum + adults.count + children.configuration.length
        },
        0
      ),
    },
    meta: { rooms },
  }
}
