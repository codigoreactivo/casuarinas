import React from 'react'
import Link from 'next/link'
import { CiLogin } from "react-icons/ci";


const AuthComponent = () => {
    return (
        <div>
            <Link href='/auth' className=' bg-red-500 px-4 py-1 rounded-xl hover:bg-blue-500 transition-all duration-300 ease-in inline-flex items-center justify-center gap-2'>Iniciar Sesion<CiLogin /></Link>



        </div>
    )
}

export default AuthComponent