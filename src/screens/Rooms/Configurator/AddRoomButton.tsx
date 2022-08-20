import React from "react"
import Button from "../../../components/ui/Button"
import { Plus } from "phosphor-react"
import { useAppDispatch } from "../../../core/redux/store"
import { addRoom } from "../../../core/modules/rooms/slice"

const AddRoomButton = () => {
  const dispatch = useAppDispatch()
  const onClick = () => dispatch(addRoom())

  return (
    <Button
      onClick={onClick}
      className="h-12 w-full flex items-center justify-center bg-blue-50 bg-opacity-30 text-purple-600 border border-solid border-blue-100 rounded-md"
    >
      <Plus weight="bold" size={20} className="mr-2" />
      <span className="font-semibold">Add Room</span>
    </Button>
  )
}

export default React.memo(AddRoomButton)
