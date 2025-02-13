import React from 'react'
import { Link } from 'react-router-dom';

const ListMovieCard = ({ movie, ranked }) => {
    const imageUrl = movie.image ? `https://image.tmdb.org/t/p/w500/${movie.image}` : '../images/no-image-1.png';
   
    return (
        <div className='flex flex-col items-center w-full h-full'>
            <Link to={`/film/${movie.id}`} className='rounded-md relative group w-full h-full'>
                {movie.poster_path || movie.image ? <img src={imageUrl} alt={movie.title} className='w-full rounded-md'/> : (
                    <div className='w-full h-full bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>{movie.title}</div>
                )}
                <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-md'></div>
            </Link>
            {ranked && <div className='text-center text-white font-semibold'>{movie.order + 1}</div>}
        </div>
    )
}

export default ListMovieCard