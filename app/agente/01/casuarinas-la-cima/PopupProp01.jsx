import React from 'react';
import { BsArrowRight, BsArrowLeftRight, BsWhatsapp, BsX, BsArrowBarLeft } from 'react-icons/bs';


const PopupProp = ({ popupContent, setPopupContent, numbrokers }) => {
    if (!popupContent) return null;

    return (
        <div className="popup absolute top-5 right-4 bg-white pt-16 pb-8 rounded-lg shadow-lg px-6 w-full">
            <div className=' absolute top-4 right-0  w-full flex px-5 justify-between text-gray-900 cursor-pointer  ' onClick={() => setPopupContent(null)}>
                <div className=' flex gap-2 text-sm items-center justify-center bg-gray-300 px-2 py-0 rounded-md hover:bg-slate-800 hover:text-white duration-300 transition-all ease-linear'><BsArrowBarLeft />Volver</div>
                <button className="text-3xl bg-green-100 rounded-full p-1 text-green-950 hover:bg-green-950 hover:text-green-200 duration-300 transition-all ease-linear" onClick={() => setPopupContent(null)}><BsX /></button>
            </div>
            <div className="popup-content h-auto flex flex-col gap-2 py-4">
                <h2 className='font-extrabold text-2xl'>Casurinas La Cima</h2>
                {popupContent.zona && (
                    <div className=' flex gap-2 font-semibold text-2xl text-green-900'>
                        <h2>Zona:</h2>
                        <p>{popupContent.zona ? <div>{popupContent.zona}</div> : null}</p>
                    </div>
                )}
                <div className='flex flex-row justify-between items-center my-3'>
                    <div className='flex text-lg text-green-600 font-bold gap-2'>
                        <h2>{popupContent.tipoterreno}</h2>
                        <div>{popupContent.terreno}</div>
                    </div>
                    <div>
                        {popupContent.estadoventa && (
                            <p className={`p-2 rounded-md text-white ${popupContent.estadoventa === 'Vendido' ? 'bg-red-700' : popupContent.estadoventa === 'Entregado' ? 'bg-[#DB570F]' : 'bg-[#2E603B]'}`}>
                                {popupContent.estadoventa}
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex flex-row justify-between text-lg'>
                    <div className=' text-base font-bold'>Área Total:</div>
                    <div>{popupContent.areaterreno}m<sup>2</sup></div>
                </div>
                <div className='flex flex-row justify-between'>
                    <ul className='flex flex-col gap-4 my-3 w-full'>
                        <li className=' w-full flex flex-row justify-between items-center'><p className=' flex items-center justify-start gap-3'>{/*<BsArrowLeftRight className=' bg-green-200 text-black p-3 text-5xl rounded-full' />*/}-Frente</p><p className=' text-base font-bold text-green-950'>{popupContent.frente}m</p></li>
                        <li className=' w-full flex flex-row justify-between items-center'><p className=' flex items-center justify-start gap-3'>{/*<BsArrowRight className=' bg-green-200 text-black p-3 text-5xl rounded-full' />*/}-Derecha</p><p className=' text-base font-bold text-green-950'>{popupContent.derecha}m</p></li>
                        <li className=' w-full flex flex-row justify-between items-center'><p className=' flex items-center justify-start gap-3'>{/*<BsArrowRight className=' rotate-180 bg-green-200 text-black p-3 text-5xl rounded-full' />*/}-Izquierda</p><p className=' text-base font-bold text-green-950'>{popupContent.izquierda}m</p></li>
                        <li className=' w-full flex flex-row justify-between items-center'><p className=' flex items-center justify-start gap-3'>{/*<BsArrowLeftRight className=' bg-green-200 text-black p-3 text-5xl rounded-full' />*/}-Fondo</p><p className=' text-base font-bold text-green-950'>{popupContent.fondo}m</p></li>
                    </ul>
                </div>
                <a href={numbrokers} target='_blank' className='bg-[#00D95F] text-white font-medium text-center text-xl mb-[-24px] py-3 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-green-800 duration-300 transition-all ease-linear'> <BsWhatsapp /> Contacta con un asesor</a>
            </div>
        </div>
    );
};

export default PopupProp;