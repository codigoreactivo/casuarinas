'use client'
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SideBarMenu from "./SideBarMenu";
import { LiaMapMarkedSolid, LiaMapSignsSolid } from "react-icons/lia";
import { RiMenu2Fill, RiArrowDropDownLine } from "react-icons/ri";

const NavBar = () => {
  const [dropdowns, setDropdowns] = useState({
    proyectos: false,
    ejemplos: false,
  });

  const toggleDropdown = (dropdown) => {
    setDropdowns((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  return (
    <div className="absolute w-auto h-auto flex flex-col text-center p-4 text-white gap-3 z-50">
      <div className="bg-black/70 flex flex-row justify-center items-center p-2 rounded-xl gap-4">
        <div className="place-self-start self-center">

        </div>
        <Link href="/">
          <div className="inline-flex  justify-center items-center gap-4">
            <img src="/logocasuarinas.png" alt="" className=" w-24" />
            <div className=" text-left">
              <h1 className="font-regular text-lg font-semibold">Casuarinas Grupo</h1>
              <p className="text-xs font-light text-white/85">Mapa Inreractivo: Vista de Lotes</p>
            </div>
          </div>
        </Link>
        <div className="place-self-end self-center"></div>
      </div>
      <div className="bg-black/70 w-fit p-3 rounded-2xl">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-3">
            <div className="flex cursor-pointer justify-start items-center gap-2 rounded-lg transition-all ease-in duration-300 focus:bg-white focus:text-black">
              <div className="h-full self-start">
                <RiMenu2Fill className="text-[2.5rem] rounded-xl border border-white/30 p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in cursor-pointer" />
              </div>
              <p className="leading-none p-0 mt-1 flex">Menu</p>
            </div>
            <div className="inline-flex items-center gap-3">
              <div className="h-full self-start">
                <LiaMapMarkedSolid className="text-[2.5rem] rounded-xl border border-white/30 p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in cursor-pointer" onClick={() => toggleDropdown('proyectos')} />
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="inline-flex pt-2 pb-1">
                  <p className="border-b border-white/20 pb-1">Proyectos</p>
                  <RiArrowDropDownLine className="text-2xl hover:text-gray-400 duration-300 transition-all ease-in cursor-pointer" onClick={() => toggleDropdown('proyectos')} />
                </div>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${dropdowns.proyectos ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex flex-col items-start gap-1 text-sm text-white/80 py-2">
                      <div className="hover:bg-white p-1 rounded hover:text-black/70 transition-all duration-300 ease-in cursor-pointer">
                        <Link href="/casuarinas-sur">Caruarinas Sur</Link>
                      </div>
                      <div className="hover:bg-white p-1 rounded hover:text-black/70 transition-all duration-300 ease-in cursor-pointer">
                        <Link href="/casuarinas-la-cima">Caruarinas La Cima</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-3">
              <div className="h-full self-start">
                <LiaMapSignsSolid className="text-[2.5rem] rounded-xl border border-white/30 p-2 hover:bg-white hover:text-black transition-all duration-300 ease-in cursor-pointer" onClick={() => toggleDropdown('ejemplos')} />
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="inline-flex pt-2 pb-1">
                  <p className="border-b border-white/20 pb-1">Ejemplos</p>
                  <RiArrowDropDownLine className="text-2xl hover:text-gray-400 duration-300 transition-all ease-in cursor-pointer" onClick={() => toggleDropdown('ejemplos')} />
                </div>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${dropdowns.ejemplos ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col items-start gap-1 text-sm text-white/80 py-2">
                    <div className="hover:bg-white p-1 rounded hover:text-black/70 transition-all duration-300 ease-in cursor-pointer">
                      <Link href="/example">Mapar de Ejemplo</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Agrega más dropdowns aquí siguiendo el mismo patrón */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;