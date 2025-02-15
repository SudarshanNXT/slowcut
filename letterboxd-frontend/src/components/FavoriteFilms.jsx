import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import SubSearchForm from './SubSearchForm';
import { Link } from 'react-router-dom';
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

const FavoriteFilms = ({ authorized, favorite_films, setUpdate }) => {
    const [index, setIndex] = useState(null)
    const [subSearch, setSubSearch] = useState(false)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const isFullCheck = (arr) => arr.every(Boolean)
    const isFull = isFullCheck(favorite_films)

    const handleFavoriteFilmDelete = async (e, movie_id) => {
        e.stopPropagation()
        e.preventDefault()
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_favorite_film/${movie_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleReplaceClick = (e, replace_index) => {
        e.stopPropagation()
        e.preventDefault()
        setIndex(replace_index)
        setSubSearch(true)
    }

    return (
        <>
            <SubSearchForm subSearch={subSearch} setSubSearch={setSubSearch} favorite_films={favorite_films} replace_index={index} setIndex={setIndex} setUpdate={setUpdate}/>

            <div className='grid grid-cols-[90px_90px_90px_90px] md:grid-cols-[150px_150px_150px_150px] gap-3 w-full md:w-fit justify-center'>
                
                <div className='col-span-4 uppercase border-b border-b-gray-400 mb-3 text-gray-300'>Favorite Films</div>

                {favorite_films.map((movie, index) => (
                    movie ? (
                        <Link to={`/film/${movie.movie.id}`} key={index} className='relative group'>
                            {movie.movie.image ? <img src={`https://image.tmdb.org/t/p/w500/${movie.movie.image}`} alt={movie.movie.title} className='w-full rounded-md'/>
                            : <div className='w-full h-full bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md text-lg'>{movie.movie.title}</div>}
                            {authorized && <button onClick={(e) => handleFavoriteFilmDelete(e, movie.movie.id)} className='md:hidden md:group-hover:block absolute -top-1 -right-1 bg-gray-500 text-white rounded-full p-1 font-bold'><IoClose size={20}/></button>}
                            {authorized && isFull &&
                                <button onClick={(e) => handleReplaceClick(e, index)} className='md:hidden md:group-hover:block absolute -top-1 -left-1 bg-gray-500 text-white rounded-full p-1 font-bold'><HiOutlineSwitchHorizontal size={20}/></button>
                            }
                        </Link>
                    ) : (
                        <div key={index} className='w-[90px] h-[135px] md:w-[150px] md:h-[225px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>
                            {authorized && 
                                <button 
                                    className='h-[45px] w-[45px] rounded-full bg-gray-800 flex items-center justify-center shadow-xl hover:shadow-gray-300 hover:shadow-2xl opacity-70 hover:opacity-100'
                                    onClick={() => setSubSearch(true)}
                                    >
                                    <FaPlus className='text-gray-300 hover:text-white' 
                                    size={28}/>
                                </button>
                            }
                        </div>
                    )
                ))}
                
            </div>
        </>
    )
}

export default FavoriteFilms