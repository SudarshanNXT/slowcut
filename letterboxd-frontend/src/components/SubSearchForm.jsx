import React, { useState } from 'react'
import { Form } from 'react-router-dom'
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import SubSearchCard from './cards/SubSearchCard';

const SubSearchForm = ({ subSearch, setSubSearch, favorite_films, replace_index, setIndex, setUpdate }) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const handleSearch = async (e = null, argPage = null) => {
        e ? e.preventDefault() : ''
        try {
            if(query.length > 0){
                const response = await fetch(`${apiBaseUrl}/tmdb/search?query=${query}&page=1&type=films`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setResults(data.results)
                } else {
                    const error = await response.json()
                    throw new Error(error)
                }
            }
        } catch (error) {
            console.error(error.message)
        }
    }
    
    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${subSearch ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col space-y-3 p-3 mx-4 md:mx-0 w-full md:w-[800px] bg-light rounded-md relative ${subSearch ? '' : 'scale-50'} transition-all duration-200`}>
                
                <div className='flex items-center justify-between'>
                    <div className='text-white text-lg font-semibold uppercase'>Pick a favorite film</div>
                    <button onClick={() => setSubSearch(false)} className=' text-xl text-gray-300'>
                        <IoClose size={30}/>
                    </button>
                </div>

                <div className='relative'>
                    <Form onSubmit={handleSearch}>
                        <label htmlFor="search_query" className='text-white'>Name of film</label>
                        <div className='flex items-center bg-gray-400 focus-within:bg-white focus-within:text-black rounded-md p-2'>
                            <input 
                                id='search_query'
                                type='text'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className='focus:outline-none w-full h-full bg-transparent'
                            />
                            <button className='text-black self-end h-full'>
                                <FaSearch />
                            </button>
                        </div>
                    </Form>

                    {results && results.length > 0 &&
                        <div className='absolute top-full left-0 w-full flex flex-col space-y-1 h-[350px] overflow-y-auto rounded-md bg-gray-800 p-2'>
                            {results.map((movie, index) => (
                                <SubSearchCard 
                                    key={index} 
                                    movie={movie} 
                                    favoriteFilmsLength={favorite_films.length} 
                                    setResults={setResults} 
                                    setQuery={setQuery} 
                                    index={replace_index} 
                                    setIndex={setIndex}
                                    setUpdate={setUpdate}
                                    setSubSearch={setSubSearch}
                                />
                            ))}
                        </div>
                    }
                    {results && results.length === 0 &&
                        <div className='absolute top-full left-0 w-full h-fit rounded-md bg-gray-800 p-2 text-white'>
                            No results to display
                        </div>
                    }
                </div>
                
            </div>
        </div>
    )
}

export default SubSearchForm