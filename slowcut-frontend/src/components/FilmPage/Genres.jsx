import React from 'react'

const Genres = ({ genres, keywords }) => {
    return (
        <div className='flex flex-col space-y-2 mt-2 text-gray-300'>
            <div className='grid grid-cols-2 gap-2'>
                <div className='border-b h-fit'>Genres:</div>
                <div className='flex flex-wrap gap-1 pt-2'>
                    {genres.map((item, index) => (
                        <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded' key={`genre-${index}`}>{item.name}</div>
                    ))}
                </div>
            </div>
            
            <div className='grid grid-cols-2 gap-2'>
                <div className='border-b h-fit'>Keywords:</div>
                <div className='flex flex-wrap gap-1 pt-2'>
                    {keywords.map((keyword, index) => (
                        <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded' key={`keyword-${index}`}>{keyword.name.charAt(0).toUpperCase() + keyword.name.slice(1)}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Genres