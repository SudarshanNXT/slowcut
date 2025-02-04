import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { MdImageNotSupported } from "react-icons/md";

const ResultCard = ({ result }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const [director, setDirector] = useState(null)
    
    let link = '', subLabel = ''

    if(result.media_type === 'movie'){
        link += `/film/${result.id}`
    } else if(result.media_type === 'person'){
        link += `/person/${result.id}`
    }

    const imageUrl = result.poster_path || result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path || result.profile_path}` : '';

    const getDirector = async (id) => {
        try {
            const response = await fetch(`${apiBaseUrl}/tmdb/get_director/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = await response.json()
                setDirector(data)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div to={link} className='border-b border-b-gray-500 py-3 flex space-x-3'>
            <Link to={link} className='relative group'>
                {imageUrl ? <img src={imageUrl} alt={result.name || result.title} className='h-[105px] w-[70px] md:h-[111px] md:w-[76px] rounded-md'/> : (
                    <div className='h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>
                        <MdImageNotSupported size={50}/>
                    </div>
                )}

                <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-md'></div>
            </Link>

            <div className='flex flex-col space-y-1'>
                <div className='flex space-x-3 items-end'>
                    <Link className='text-2xl font-bold text-white hover:text-blue-500' to={link}>{result.name || result.title} </Link>
                    <span className='text-xl'>{result.release_date ? result.release_date.slice(0, 4) : ''}</span>
                </div>
                {result.original_title && <div>Original title: {result.original_title}</div>}
                {result.genres && result.genres.length > 0 &&
                    <div className='flex items-center'>
                        <div className='mr-2'>Genres:</div>
                        <div className='flex space-x-1'>{result.genres.map((genre, index) => <div key={index}>{genre}{index != result.genres.length - 1 ? ',' : ''}</div>)}</div>
                    </div>
                }
                {result.known_for && result.known_for.length > 0 && 
                    <div className='flex items-start md:items-center'>
                        <div className='mr-2 text-nowrap'>Known for: </div>
                        <div className='flex flex-wrap items-center gap-2 md:gap-0 md:space-x-2'>
                            {result.known_for.map((movie, index) => (
                                movie.media_type === 'movie' ? (
                                    <Link to={`/film/${movie.id}`} className=' bg-gray-600 text-white text-sm p-1 rounded-md hover:text-blue-500' key={index}>{movie.title}</Link>
                                ) : (
                                    <div className=' bg-gray-600 text-white text-sm p-1 rounded-md' key={index}>{movie.title || movie.name}</div>
                                )   
                            ))}
                        </div>
                    </div>
                }
                {result.media_type === 'movie' && 
                    <div className='relative'>
                        <button className={`bg-gray-600 text-gray-200 hover:text-white text-sm p-1 rounded-md  ${director ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} onClick={() => getDirector(result.id)}>Reveal Director</button>

                        {director && <Link className='absolute left-0 top-0 text-sm py-1 rounded-md text-nowrap hover:text-blue-500' to={`/person/${director.id}`}>Director: {director.name}</Link>}
                    </div>
                }
            </div>
        </div>
    )
}

export default ResultCard