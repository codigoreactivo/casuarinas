import React from 'react';
import { BsFlagFill } from 'react-icons/bs';

const StatusProp = () => {
    return (
        <div className='w-fit absolute bottom-20 left-0 right-0 m-auto'>
            <div className='bg-white py-2 px-3 rounded-lg shadow-md flex gap-2'>
                <div className='flex flex-row gap-2 items-center bg-[#2E603B]/10 py-2 px-3 rounded-lg'>
                    <BsFlagFill className='text-[#2E603B] text-lg' />
                    <p className='text-sm font-medium text-[#2E603B]'>Disponible</p>
                </div>
                <div className='flex flex-row gap-2 items-center bg-[#DB570F]/10 py-2 px-3 rounded-lg'>
                    <BsFlagFill className='text-[#DB570F] text-lg' />
                    <p className='text-sm font-medium text-[#DB570F]'>Entregado</p>
                </div>
            </div>
        </div>
    );
}

export default StatusProp;
