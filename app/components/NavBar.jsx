import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SideBarMenu from './SideBarMenu'
import AuthComponent from './AuthComponent'

const NavBar = () => {

  return (
    <div className=' w-full h-[60px] grid grid-cols-3 justify-between text-center items-center px-4 bg-black text-white'>
      <div className=' place-self-start self-center'>
        <SideBarMenu></SideBarMenu>
      </div>
      <Link href='/'><div><h1 className=' font-regular text-2xl font-semibold '>Casuarinas Grupo</h1></div></Link>
      <div className=' place-self-end self-center'>

      </div>
    </div>
  )
}

export default NavBar