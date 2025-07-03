import React from 'react'
import { IoIosStar } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';

const MiniMovieCard = ({ movie, rating, liked }) => {

    const imageUrl = movie.image ? `https://image.tmdb.org/t/p/w500/${movie.image}` : '../images/no-image-1.png';

    const ratingArr = (rating !== undefined && rating !== null) ? new Array(rating).fill(true) : false
    
    return (
        <div className='flex flex-col'>
            <Link to={`/film/${movie.id}`} className='relative group'>
                {movie.image ? <img src={imageUrl} alt={movie.title} className='h-[111px] w-[76px] rounded-md'/> : (
                    <div className='h-[111px] w-[76px] bg-gray-600 text-gray-300 flex items-center justify-center text-center rounded-md text-sm truncate'>{movie.title}</div>
                )}
                <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-md'></div>
            </Link>

            <div className='flex items-center mt-1'>
                {ratingArr &&
                    ratingArr.map((num, index) => (
                        <IoIosStar key={index} size={10} className='text-gray-400'/>
                    ))
                }
                {liked && <FaHeart className='h-[10px] text-gray-400'/>}
            </div>
        </div>
    )
}

export default MiniMovieCard