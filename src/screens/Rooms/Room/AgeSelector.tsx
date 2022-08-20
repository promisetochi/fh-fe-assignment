import { X } from "phosphor-react"
import React, { ComponentProps } from "react"
import Button from "../../../components/ui/Button"
import Dropdown from "../../../components/ui/Dropdown"

type Props = {
  label: string
  // age: number
  dropdownProps: ComponentProps<typeof Dropdown>
  remove(): void
}

const AgeSelector = ({ label, dropdownProps, remove }: Props) => {
  return (
    <div className="flex items-center">
      <span className="flex-1">{label}</span>
      <Dropdown
        styles={{
          caretDownWrapper: ["flex items-center"],
          root: ["w-20 mr-2"],
          title: ["border-slate-300 rounded"],
        }}
        {...dropdownProps}
      />
      <Button onClick={remove} className="p-1.5 pr-1 text-red-600">
        <X weight="bold" />
      </Button>
    </div>
  )
}

export default AgeSelector
