import React from 'react';
import { IoMdHome, IoIosArrowBack, IoIosArrowForward, IoIosArrowUp, IoIosArrowDown, IoMdArrowDropup, IoMdArrowDropdown, IoIosAdd, IoIosRemove, IoIosExpand } from "react-icons/io";

const MapControls = ({ onHome, onMoveLeft, onMoveRight, onMoveUp, onMoveDown, onZoomIn, onZoomOut, onExpand, onPitchUp, onPitchDown }) => {

    return (
        <div className='w-fit flex flex-col md:flex-row  absolute gap-3 z-10 bottom-4 justify-center items-center left-0 right-0 mx-auto'>
            <div className=' flex gap-3'>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onHome}><IoMdHome /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onMoveLeft}><IoIosArrowBack /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onMoveRight}><IoIosArrowForward /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onMoveUp}><IoIosArrowUp /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onMoveDown}><IoIosArrowDown /></button>
            </div>
            <div className=' flex gap-3'>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onPitchUp}><IoMdArrowDropup /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onPitchDown}><IoMdArrowDropdown /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onZoomIn}><IoIosAdd /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onZoomOut}><IoIosRemove /></button>
                <button className="rounded-full p-3 bg-white text-2xl flex flex-col justify-center items-center transition-all duration-300 ease-out hover:bg-black hover:text-white" onClick={onExpand}><IoIosExpand /></button>
            </div>
        </div>
    );
};

export default MapControls;
