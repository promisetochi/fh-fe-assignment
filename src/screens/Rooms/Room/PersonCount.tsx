import { Minus, Plus } from "phosphor-react"
import React from "react"
import Button from "../../../components/ui/Button"

type Props = {
  label: string
  count: number
  changeCount(count: number): void
}

const PersonCount = ({ label, count, changeCount }: Props) => {
  const reduce = () => changeCount(-1)
  const increase = () => changeCount(1)
  return (
    <div className="flex items-center">
      <span className="flex-1 font-medium">{label}</span>
      <div className="w-28 inline-flex items-center">
        <Button
          onClick={reduce}
          className="h-8 w-8 inline-flex items-center justify-center bg-blue-50 border border-solid border-blue-200 rounded text-blue-700"
        >
          <Minus weight="bold" />
        </Button>
        <span className="w-12 text-center">{count}</span>
        <Button
          onClick={increase}
          className="h-8 w-8 inline-flex items-center justify-center bg-blue-50 border border-solid border-blue-200 rounded text-blue-700"
        >
          <Plus weight="bold" />
        </Button>
      </div>
    </div>
  )
}

export default PersonCount
