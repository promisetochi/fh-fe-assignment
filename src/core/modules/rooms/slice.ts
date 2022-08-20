import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit"
import { limits } from "../../../lib/config"
import type { Room, Rooms } from "../../../lib/RoomsLexer"
import { RoomsLexer } from "../../../lib/RoomsLexer"
import { conscriptToRange } from "../../../lib/util"
import { RootState } from "../../redux/store"

const MAX_ADULTS = limits.rooms.adultsPerRoomRange[1]
const MIN_ADULTS = limits.rooms.adultsPerRoomRange[0]
const MAX_CHILDREN = limits.rooms.childrenPerRoomRange[1]
const MIN_CHILDREN = limits.rooms.childrenPerRoomRange[0]
const MAX_OCCUPANTS = limits.rooms.roomOccupancyRange[1]
const MIN_OCCUPANTS = limits.rooms.roomOccupancyRange[0]
const MAX_ROOMS = limits.rooms.roomsRange[1]
const MIN_ROOMS = limits.rooms.roomsRange[0]
const MIN_CHILD_AGE = limits.rooms.childAgeRange[0]
const MAX_CHILD_AGE = limits.rooms.childAgeRange[1]

const initialState: Rooms = {
  type: "Rooms",
  configuration: [
    {
      type: "Room",
      configuration: [
        {
          type: "Adults",
          count: 1,
        },
        {
          type: "Children",
          configuration: [],
        },
      ],
    },
  ],
}

export const {
  reducer: roomsReducer,
  actions: {
    addRoom,
    removeRoom,
    changeAdultsCount,
    changeChildrenCount,
    removeChild,
    setChildAge,
    initRooms,
  },
} = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction) => {
      if (state.configuration.length < MAX_ROOMS)
        state.configuration.push(RoomsLexer.createRoom())
    },
    removeRoom: (state, action: PayloadAction<{ index: number }>) => {
      if (state.configuration.length > MIN_ROOMS)
        state.configuration.splice(action.payload.index, 1)
    },
    changeAdultsCount: (
      state,
      action: PayloadAction<{ room: number; change: number }>
    ) => {
      const { change, room } = action.payload
      // Beyond this assignment, I would spend more time and abstract this to a function like getAdults(arg: Rooms)
      const adults = state.configuration[room].configuration[0]
      const newCount = adults.count + change
      const newTotal =
        newCount +
        // Same here, getNumOfChildren(arg: Rooms)
        state.configuration[room].configuration[1].configuration.length
      if (newTotal <= MAX_OCCUPANTS) {
        adults.count = conscriptToRange(newCount, MAX_ADULTS, MIN_ADULTS)
      }
    },
    changeChildrenCount: (
      state,
      action: PayloadAction<{ room: number; change: number }>
    ) => {
      const { change, room } = action.payload
      const children = state.configuration[room].configuration[1]
      const childrenCount = children.configuration.length
      const newTotal =
        childrenCount + state.configuration[room].configuration[0].count

      if (
        change < 0 &&
        childrenCount > MIN_CHILDREN &&
        newTotal > MIN_OCCUPANTS
      ) {
        children.configuration.splice(-1, 1)
      } else if (
        change > 0 &&
        childrenCount < MAX_CHILDREN &&
        newTotal < MAX_OCCUPANTS
      ) {
        children.configuration.push(RoomsLexer.createChild())
      }
    },
    removeChild: (
      state,
      action: PayloadAction<{ room: number; child: number }>
    ) => {
      const { room, child } = action.payload
      state.configuration[room]?.configuration[1].configuration.splice(child, 1)
    },
    setChildAge: (
      state,
      action: PayloadAction<{ room: number; child: number; age: number }>
    ) => {
      const { room, child, age } = action.payload
      const _child =
        state.configuration[room].configuration[1].configuration[child]

      if (_child) _child.age = age
    },
    initRooms: (state, action: PayloadAction<Rooms>) => {
      // Sorry, long validation. Can refactor...
      return {
        ...action.payload,
        configuration: action.payload.configuration
          .map((room) => {
            const [adult, children] = room.configuration
            const total = adult.count + children.configuration.length
            return {
              ...room,
              configuration: [
                {
                  type: "Adults",
                  count: total > MAX_OCCUPANTS ? 2 : adult.count,
                },
                {
                  type: "Children",
                  configuration: (total > MAX_OCCUPANTS
                    ? children.configuration.slice(0, 3)
                    : children.configuration
                  ).map((child) => ({
                    type: "Child",
                    age: conscriptToRange(
                      child.age,
                      MAX_CHILD_AGE,
                      MIN_CHILD_AGE
                    ),
                  })),
                },
              ],
            } as Room
          })
          .slice(0, MAX_ROOMS),
      }
    },
  },
})

export const selectRooms = createSelector(
  (state: RootState) => state,
  (state) => state.rooms
)
