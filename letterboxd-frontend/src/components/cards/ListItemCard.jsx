import React from 'react'
import { IoMdClose } from "react-icons/io";
import { HiBars3 } from "react-icons/hi2";

const ListItemCard = ({ movie, ranked, list_id, setUpdate, createListPage, handleListItemDelete, index, setDraggedIndex, handleDrop }) => {
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

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    }

    const handleDragOver = (e, index) => {
        e.preventDefault()
    }
    
    return (
        <div 
            className='flex justify-between items-center py-2 border-b border-b-gray-500 cursor-move hover:bg-gray-700'
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
        >
            <div className='flex items-center space-x-2'>
                {ranked && <div className='border border-gray-500 h-[58px] w-[52px] flex items-center justify-center rounded-md text-white text-2xl'>{index + 1}</div>}
                {movie.image || movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w500/${movie.image || movie.poster_path}`} alt={movie.title} className='h-[58px] w-[40px] aspect-[2/3] rounded-sm object-cover'/> : (
                    <div className='h-[58px] aspect-[2/3] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-sm'></div>
                )}
                <div className='inline-flex items-center space-x-2'>
                    <span className='text-xl font-bold text-white line-clamp-1'>{movie.title}</span>
                    {movie.release_date && <span className='text-lg text-gray-300'>{movie.release_date.slice(0, 4)}</span>}
                </div>
            </div>

            <div className='inline-flex gap-x-2 h-full items-center pr-2 text-gray-300'>
                <button onClick={(e) => createListPage ? handleListItemDelete(index) : handleItemDelete(e)}><IoMdClose className='hover:text-accent' size={25}/></button>
                <HiBars3 size={25}/>
            </div>
            
        </div>
    )
}

export default ListItemCard