import React, { useState } from 'react'

const FavoriteFilms = ({ authorized, favorite_films, setUpdate }) => {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [results, setResults] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    const [index, setIndex] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const handleSearch = async (e = null, argPage = null) => {
        e ? e.preventDefault() : ''
        try {
            if(query.length > 0){
                const response = await fetch(`${apiBaseUrl}/tmdb/search?query=${query}&page=${argPage ? argPage : page}&type=films`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setResults(data.results)
                    setTotalPages(data.total_pages)
                    console.log(data);
                } else {
                    const error = await response.json()
                    throw new Error(error)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleShowMore = async (command) => {
        const newPage = command === 'more' ? page + 1 : page - 1
        setPage(prev => command === 'more' ? prev + 1 : prev - 1)
        handleSearch(null, newPage)
    }

    const handleAddFavoriteFilm = async (result) => {
        try {
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
                    genres: result.genres,
                    release_date: result.release_date,
                    index: favorite_films.length === 4 ? index : null
                })
            })
            if(response.ok){
                const data = await response.json()
                setResults(null)
                setPage(1)
                setTotalPages(null)
                setQuery('')
                setIndex(null)
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleFavoriteFilmDelete = async (movie_id) => {
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
            console.log(error.message)
        }
    }

    return (
        <div>
            {favorite_films.length > 0 ? (
                <div className='flex space-x-2'>
                    {favorite_films.map((item, index) => (
                        <div key={index}>
                            <div>{item.movie.title}</div>
                            {authorized && favorite_films.length === 4 && 
                                <button onClick={() => setIndex(index)} className='bg-green-400'>Replace</button>
                            }
                            {authorized && 
                                <button onClick={() => handleFavoriteFilmDelete(item.id)} className='bg-red-300'>Delete</button>
                            }
                        </div>
                    ))}
                </div>
            ) : (
                <div>No favorite films</div>
            )}

            {authorized && 
                <div>index to be replaced: {index ? index : 'not yet'}</div>
            }

            {authorized && 
                <form onSubmit={handleSearch}>
                    <input 
                        type='text'
                        placeholder='search for film...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='border-2'
                    />
                </form>
            }
            {results && results.length > 0 && 
                <>
                    <div className='flex flex-col'>
                        {results.map((result, index) => (
                            <button onClick={() => handleAddFavoriteFilm(result)} key={index}>{result.title}</button>
                        ))}
                    </div>

                    {totalPages && page < totalPages && 
                        <button onClick={() => handleShowMore('more')} className='bg-gray-500'>Show more results</button>
                    } 

                    {totalPages && page > 1 && 
                        <button onClick={() => handleShowMore('back')} className='bg-red-500'>Go back</button>
                    }
                </>
            }
        </div>
    )
}

export default FavoriteFilms