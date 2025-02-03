import React from 'react'
import { Link } from 'react-router-dom';

const ResultCard = ({ result }) => {
    
    let link = '', subLabel = ''

    if(result.media_type === 'movie'){
        link += `/film/${result.id}`
    } else if(result.media_type === 'person'){
        link += `/person/${result.id}`
    }

    const imageUrl = result.poster_path || result.profile_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path || result.profile_path}` : '../images/no-image-1.png';

    return (
        <Link to={link} className=''>
            <img src={imageUrl} alt={result.name || result.title} className='h-[194px]'/>
        </Link>
    )
}

export default ResultCard