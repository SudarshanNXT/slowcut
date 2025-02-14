import React from 'react'
import { Link } from 'react-router-dom';
import { MdImageNotSupported } from "react-icons/md";
import { formatDate } from '../../utils/formatDate';

const ReviewCard = ({ review }) => {
    
    const imageUrl = review.movie.image ? `https://image.tmdb.org/t/p/w500/${review.movie.image}` : '';
    const dateStr = formatDate(review.created_at)
    
    return (
        <div className='flex space-x-4 border-b border-b-gray-500 py-3'>
            <Link to={`/film/${review.movie.id}`} className='relative group rounded-md flex-shrink-0 h-fit'>
                {imageUrl ? <img src={imageUrl} alt={review.movie.name || review.movie.title} className='h-[105px] w-[70px] md:h-[111px] md:w-[76px] rounded-md'/> : (
                    <div className='h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>
                        <MdImageNotSupported size={40}/>
                    </div>
                )}
                <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-md'></div>
            </Link>
            <div className='flex flex-col space-y-1'>
                <div className='inline-flex items-end space-x-2'>
                    <Link to={`/film/${review.movie.id}`} className='text-2xl font-bold text-white hover:text-blue-500 line-clamp-1'>{review.movie.title}</Link>
                    <div className='text-gray-300'>{review.movie.release_date.slice(0, 4)}</div>
                </div>
                <div className='text-gray-500'>{dateStr}</div>
                <div className='text-gray-300'>{review.body}</div>
                <Link to={`/review/${review._id}`} className='bg-hover hover:bg-green-500 px-2 rounded-md text-white w-fit'>See Full Review</Link>
            </div>
        </div>
    )
}

export default ReviewCard