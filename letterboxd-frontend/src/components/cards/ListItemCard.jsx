import React from 'react'
import { IoMdClose } from "react-icons/io";

const ListItemCard = ({ movie, ranked, list_id, setUpdate }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    
    const handleItemDelete = async (e) => {
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to delete this movie from the list?')
        if(!confirm) return

        try {
            const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_list`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: movie._id,
                    list_id: list_id
                })
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return (
        <div className='flex justify-between items-center py-2 border-b border-b-gray-500'>
            <div className='flex items-center space-x-2'>
                {ranked && <div className='border border-gray-500 h-[58px] w-[52px] flex items-center justify-center rounded-md text-white text-2xl'>{movie.order + 1}</div>}
                {movie.image ? <img src={`https://image.tmdb.org/t/p/w500/${movie.image}`} alt={movie.title} className='h-[58px] w-[40px] aspect-[2/3] rounded-sm object-cover'/> : (
                    <div className='h-[58px] aspect-[2/3] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-sm'></div>
                )}
                <div className='inline-flex items-center space-x-2'>
                    <span className='text-xl font-bold text-white'>{movie.title}</span>
                    {movie.release_date && <span className='text-lg text-gray-300'>{movie.release_date.slice(0, 4)}</span>}
                </div>
            </div>

            <div className='inline-flex h-full items-center pr-2'>
                <button onClick={(e) => handleItemDelete(e)}><IoMdClose className='text-gray-300 hover:text-accent' size={25}/></button>
            </div>
        </div>
    )
}

export default ListItemCard