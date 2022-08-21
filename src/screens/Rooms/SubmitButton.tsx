import React, { useCallback } from "react"
import Button from "../../components/ui/Button"
import { MagnifyingGlass } from "phosphor-react"
import { useRooms, useRoomsStats } from "../../core/modules/rooms/hooks"
import { useNavigate, useSearchParams } from "react-router-dom"
import { RoomsLexer } from "../../lib/RoomsLexer"

const SubmitButton = () => {
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const {
    rooms: { count: roomsCount },
    guests: { count: guestsCount },
    meta: { rooms },
  } = useRoomsStats()
  const navigateToConfig = useCallback(() => {
    const rm = new RoomsLexer()
    try {
      const configuration = rm.compile(rooms)
      search.set("rooms", configuration)
      navigate(`?${decodeURIComponent(search.toString())}`)
    } catch (e) {}
  }, [rooms, search])
  return (
    <Button
      onClick={navigateToConfig}
      className="w-full h-10 flex items-center justify-center rounded bg-purple-600 text-white"
    >
      <MagnifyingGlass size={20} className="mr-1" />
      <span className="mr-2 font-semibold">Search</span>
      <span className="opacity-70">{roomsCount} room(s)</span>
      <span className="w-1 h-1 mx-1 rounded-full bg-white"></span>
      <span className="opacity-70">{guestsCount} guest(s)</span>
    </Button>
  )
}

export default SubmitButton
