import React from 'react'
import { MdImageNotSupported } from "react-icons/md";
import { getGenreObjects } from '../../utils/getGenres';

const SuperMegaFormCard = ({ movie, handleMovieClick }) => {
    
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '';
    
    return (
        <button type='button' onClick={() => handleMovieClick(movie)} className='flex items-center hover:bg-hover p-1 rounded-md'>
            {imageUrl ? <img src={imageUrl} alt={movie.name || movie.title} className='h-[90px] w-[60px] rounded-md'/> : (
                <div className='h-[90px] w-[60px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>
                    <MdImageNotSupported size={40}/>
                </div>
            )}
            <div className='flex items-end ml-3'>
                <div className='text-white font-bold text-lg'>{movie.title}</div>
                {movie.release_date && <div className='text-gray-300 font-semibold ml-2'>{movie.release_date.slice(0, 4)}</div>}
            </div>
        </button>
    )
}

export default SuperMegaFormCard