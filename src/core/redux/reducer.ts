import { combineReducers } from "@reduxjs/toolkit"
import { roomsReducer } from "../modules/rooms/slice"

export type CreateReducerArgs = {}

const createReducer = (args?: CreateReducerArgs) => {
  return combineReducers({
    rooms: roomsReducer,
  })
}

export default createReducer
