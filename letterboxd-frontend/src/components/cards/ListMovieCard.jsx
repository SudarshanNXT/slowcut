import React from 'react'
import { Link } from 'react-router-dom';

const ListMovieCard = ({ movie, list_id }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const imageUrl = movie.image ? `https://image.tmdb.org/t/p/w500/${movie.image}` : '../images/no-image-1.png';
    
    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        try {
            const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_list`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    list_id: list_id,
                    movie_id: movie._id
                })
            })
            if(response.ok){
                const data = await response.json()
                console.log(data);
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className=''>        
            <Link to={`/film/${movie.id}`}>
                <img src={imageUrl} alt={movie.title} className='h-[200px]'/>
            </Link>
            
            <button onClick={handleDelete} className='bg-red-400'>remove</button>
        </div>
    )
}

export default ListMovieCard