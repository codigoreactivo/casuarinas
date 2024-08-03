'use client';

import Link from 'next/link';
import React from 'react';
import { RiMenu2Fill, RiUser6Fill } from "react-icons/ri";

const SideBarMenu = () => {

    const openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        console.log('Opened nav');
    };

    const closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        console.log('Closed nav');
    };

    return (
        <div>
            <div id="mySidenav" className="sidenav ">
                <div className=' px-6'>
                    {/* <div className=' flex flex-col items-start justify-start gap-4 mb-10'>
                        <div className=' bg-white rounded-full text-5xl'><RiUser6Fill className=' text-black' /></div>
                        <div>William Alcaraz</div>
                    </div>*/}
                    <button className="closebtn" onClick={closeNav}>
                        &times;
                    </button>
                    {/*<Link href="/">Inicio</Link>
                    <Link href="/casuarinas-norte">Dashboard</Link>
                    <Link href="/example">Ejemplo</Link>
                    <Link href="/casuarinas-norte">Proyectos</Link>*/}
                    <Link href="/casuarinas-sur">Casuarinas Sur</Link>
                    <Link href="/casuarinas-la-cima">Casuarinas La Cima</Link>
                    {/*<Link href="/">Mapas</Link>
                    <Link href="/">Contacto</Link>*/}
                </div>
            </div>

            {/* Use any element to open the sidenav */}
            <div className=' flex cursor-pointer justify-center items-center  gap-2 rounded-xl border-[1px] px-4 py-2 border-white hover:bg-white hover:text-black transition-all ease-in duration-300 focus:bg-white focus:text-black' onClick={openNav}><RiMenu2Fill /><p className='leading-none p-0 mt-1 self-end flex'>Menu</p></div>

        </div>
    );
};

export default SideBarMenu;
