import React from "react"
import { Dropdown as MsDropdown, IDropdownProps } from "@fluentui/react"
import { CaretDown } from "phosphor-react"

const Dropdown = (props: IDropdownProps) => {
  return (
    <MsDropdown
      {...props}
      onRenderCaretDown={(props) => <CaretDown style={props?.style} />}
    />
  )
}

export default Dropdown
