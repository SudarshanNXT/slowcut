import React from 'react'
import { MdImageNotSupported } from "react-icons/md";
import { getGenreObjects } from '../../utils/getGenres';

const SubSearchCard = ({ movie, favoriteFilmsLength, setResults, setQuery, index, setIndex, setUpdate, setSubSearch }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '';

    const handleAddFavoriteFilm = async (result) => {
        try {
            const fullGenres = getGenreObjects(result.genres)
            const response = await fetch(`${apiBaseUrl}/profile/add_favorite_film`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: result.title,
                    id: result.id,
                    image: result.poster_path,
                    genres: fullGenres,
                    release_date: result.release_date,
                    index: favoriteFilmsLength === 4 ? index : null
                })
            })
            if(response.ok){
                const data = await response.json()
                setResults(null)
                setQuery('')
                setIndex(null)
                setSubSearch(false)
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    
    return (
        <button onClick={() => handleAddFavoriteFilm(movie)} className='flex items-center hover:bg-hover p-1 rounded-md'>
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

export default SubSearchCard