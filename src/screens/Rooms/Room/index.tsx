import React from "react"
import Button from "../../../components/ui/Button"
import {
  changeAdultsCount,
  changeChildrenCount,
  removeChild,
  setChildAge,
} from "../../../core/modules/rooms/slice"
import { useAppDispatch } from "../../../core/redux/store"
import { limits } from "../../../lib/config"
import { Room as TRoom } from "../../../lib/RoomsLexer"
import { conscriptToRange } from "../../../lib/util"
import AgeSelector from "./AgeSelector"
import PersonCount from "./PersonCount"

type Props = {
  name: string
  configuration: TRoom["configuration"]
  remove?(): void
  index: number
}

const MIN_CHILD_AGE = limits.rooms.childAgeRange[0]
const MAX_CHILD_AGE = limits.rooms.childAgeRange[1]
const childAgeOptions = Array(MAX_CHILD_AGE - MIN_CHILD_AGE + 1)
  .fill("")
  .map((_, index) => {
    const val = conscriptToRange(
      MIN_CHILD_AGE + index,
      MAX_CHILD_AGE,
      MIN_CHILD_AGE
    )
    return {
      key: val,
      text: `${val}`,
    }
  })

const Room = ({ name, configuration, remove, index: roomIndex }: Props) => {
  const dispatch = useAppDispatch()

  return (
    <div className="py-4 border-b border-solid border-gray-100">
      <div className="mb-2 flex">
        <h2 className="mb-2 flex-1 text-lg font-medium">{name}</h2>
        {remove ? (
          <Button onClick={remove} className="text-red-600 font-semibold">
            Remove
          </Button>
        ) : null}
      </div>
      {configuration.map((adultOrChild, index) => {
        if (adultOrChild.type === "Adults") {
          return (
            <div key={index} className="mb-2">
              <PersonCount
                label="Adults"
                count={adultOrChild.count}
                changeCount={(change) =>
                  dispatch(changeAdultsCount({ change, room: roomIndex }))
                }
              />
            </div>
          )
        }
        if (adultOrChild.type === "Children") {
          return (
            <div key={index} className="mb-2">
              <PersonCount
                label="Children"
                count={adultOrChild.configuration.length}
                changeCount={(change) =>
                  dispatch(changeChildrenCount({ change, room: roomIndex }))
                }
              />
              <div className="mt-4 pl-3 ml-2 border-l border-solid border-gray-200">
                {adultOrChild.configuration.map((child, index) => {
                  return (
                    <div key={index} className="mb-3">
                      <AgeSelector
                        label={`Child ${index + 1} age`}
                        dropdownProps={{
                          selectedKey: child.age,
                          options: childAgeOptions,
                          onChange(_, option) {
                            dispatch(
                              setChildAge({
                                room: roomIndex,
                                child: index,
                                age: option?.key as number,
                              })
                            )
                          },
                        }}
                        remove={() =>
                          dispatch(
                            removeChild({ room: roomIndex, child: index })
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default Room
