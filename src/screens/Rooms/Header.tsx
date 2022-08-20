import React from "react"
import {X} from 'phosphor-react'
import Button from "../../components/ui/Button"

const Header = () => {
  return <header className=" flex items-center bg-white shadow">
    <Button className="h-14 w-12 inline-flex items-center justify-center"><X /></Button>
    <h1 className="flex-1 pr-12 text-center">Who is staying?</h1>
  </header>
}

export default Header