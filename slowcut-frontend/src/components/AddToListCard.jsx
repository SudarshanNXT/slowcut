import React, { useState, useEffect } from 'react'
import { IoMdCheckmark } from "react-icons/io";
import { FaLock } from "react-icons/fa";

const AddToListCard = ({ list, status, flag, toggleFlag }) => {
    return (
        <button 
            onClick={() => toggleFlag(list._id)} 
            disabled={status} 
            className={`flex justify-between px-6 py-2 w-full ${flag ? 'bg-gray-700' : ''} ${status ? 'text-gray-300' : 'text-white'}`}
        >
            <div className='flex items-center'>
                {flag && !status ? <IoMdCheckmark className='mr-2 text-hover font-bold'/> : <div className='h-4 w-4 mr-2'></div>} 
                <span>{list.name}</span>
            </div>
            <div>{list.list_items.length} {list.list_items.length === 1 ? 'film' : 'films'}</div>
        </button>
    );
};

export default AddToListCard