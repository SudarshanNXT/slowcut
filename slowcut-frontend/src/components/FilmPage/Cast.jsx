import React from 'react'
import { Link } from 'react-router-dom';

const Cast = ({ cast }) => {
    return (
        <div className='flex flex-wrap gap-1 mt-2'>
            {cast.map((item, index) => (
                <div className='relative group' key={index}>
                    <Link to={`/person/${item.id}`}  className='bg-gray-900 text-gray-300 rounded-md px-1'>{item.name}</Link>
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 
                                    bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300 text-nowrap pointer-events-none'>{item.character}</div>
                </div>
            ))}
        </div>
    )
}

export default Cast