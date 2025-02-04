import React, { useEffect, useState } from 'react'
import ResultCard from '../components/cards/ResultCard'
import sampleFilmsPageData from '../data/sampleFilmsPageData'
import MovieCard from '../components/cards/MovieCard'

const FilmsPage = () => {
    const [filter, setFilter] = useState('now_playing')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)
    const [sortingMetric, setSortingMetric] = useState('popularity_desc')
    const [results, setResults] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`${apiBaseUrl}/tmdb/films?type=${filter}&page=${page}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok){
                const data = await response.json()
                // console.log(data);
                const sortedResults = handleSorting(data.results, sortingMetric)
                setResults(sortedResults)
                setTotalPages(data.total_pages)
            }
        }
        getData()
        // const sortedResults = handleSorting(sampleFilmsPageData.results, sortingMetric)
        // setResults(sortedResults)
        // setTotalPages(sampleFilmsPageData.total_pages)
    }, [filter, page])

    const handleFilterClick = (type) => {
        setFilter(type)
        setPage(1)
    }

    const handleSortingChange = (type) => {
        const sortedResults = [...results];
        if(type === 'popularity_desc'){
            setSortingMetric(type)
            setResults(sortedResults.sort((a, b) => b.popularity - a.popularity))
        } else if(type === 'popularity_asc'){
            setResults(sortedResults.sort((a, b) => a.popularity - b.popularity))
            setSortingMetric(type)
        } else if(type === 'rating_desc'){
            setResults(sortedResults.sort((a, b) => b.vote_average - a.vote_average))
            setSortingMetric(type)
        } else if(type === 'rating_asc'){
            setResults(sortedResults.sort((a, b) => a.vote_average - b.vote_average))
            setSortingMetric(type)
        } else if(type === 'release_date_desc'){
            setResults(sortedResults.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)))
            setSortingMetric(type)
        } else if(type === 'release_date_asc'){
            setResults(sortedResults.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)))
            setSortingMetric(type)
        } else if(type === 'title_desc'){
            setResults(sortedResults.sort((a, b) => a.title.localeCompare(b.title)))
            setSortingMetric(type)
        } else if(type === 'title_asc'){
            setResults(sortedResults.sort((a, b) => b.title.localeCompare(a.title)))
            setSortingMetric(type)
        }
    }

    const handleSorting = (arr, type) => {
        if(type === 'popularity_desc'){
            return arr.sort((a, b) => b.popularity - a.popularity)
        } else if(type === 'popularity_asc'){
            return arr.sort((a, b) => a.popularity - b.popularity)
        } else if(type === 'rating_desc'){
            return arr.sort((a, b) => b.vote_average - a.vote_average)
        } else if(type === 'rating_asc'){
            return arr.sort((a, b) => a.vote_average - b.vote_average)
        } else if(type === 'release_date_desc'){
            return arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        } else if(type === 'release_date_asc'){
            return arr.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        } else if(type === 'title_desc'){
            return arr.sort((a, b) => a.title.localeCompare(b.title))
        } else if(type === 'title_asc'){
            return arr.sort((a, b) => b.title.localeCompare(a.title))
        }
    }

    return (
        <div className='space-y-4 mt-4 px-2 md:px-0'>

            {/*Filter/Sorting section */}
            <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <div className='flex flex-col md:flex-row md:items-center text-gray-300'>
                    <div className='uppercase font-semibold mr-3'>Browse By</div>
                    <div className='flex border border-gray-400  h-fit rounded-md w-fit'>
                        <button onClick={() => handleFilterClick('now_playing')} className={` ${filter === 'now_playing' ? 'bg-gray-400 text-black' : ''} px-2 py-1 border-r border-gray-400 hover:text-white`}>Now Playing</button>
                        <button onClick={() => handleFilterClick('popular')} className={` ${filter === 'popular' ? 'bg-gray-400 text-black' : ''} px-2 py-1 border-r border-gray-400 hover:text-white`}>Popular</button>
                        <button onClick={() => handleFilterClick('top_rated')} className={` ${filter === 'top_rated' ? 'bg-gray-400 text-black' : ''} px-2 py-1 border-r border-gray-400 hover:text-white`}>Top Rated</button>
                        <button onClick={() => handleFilterClick('upcoming')} className={` ${filter === 'upcoming' ? 'bg-gray-400 text-black' : ''} px-2 py-1 hover:text-white`}>Upcoming</button>
                    </div>
                </div>

                <div className="mt-4 md:mt-0">
                    <div className="font-semibold text-gray-300 mb-1">Sort results by</div>
                    <select id="sorting-metric-dropdown" className="bg-transparent w-fit outline-none text-gray-300 border border-gray-300 rounded-md px-2 py-1" onChange={(e) => handleSortingChange(e.target.value)}>
                        <option className={`bg-gray-400 text-black`} value="popularity_desc">Popularity (Descending)</option>
                        <option className={`bg-gray-400 text-black`} value="popularity_asc">Popularity (Ascending)</option>
                        <option className={`bg-gray-400 text-black`} value="rating_desc">Rating (Descending)</option>
                        <option className={`bg-gray-400 text-black`} value="rating_asc">Rating (Ascending)</option>
                        <option className={`bg-gray-400 text-black`} value="release_date_desc">Release Date (Descending)</option>
                        <option className={`bg-gray-400 text-black`} value="release_date_asc">Release Date (Ascending)</option>
                        <option className={`bg-gray-400 text-black`} value="title_desc">Title (A-Z)</option>
                        <option className={`bg-gray-400 text-black`} value="title_asc">Title (Z-A)</option>
                    </select>
                </div>
            </div>

            {/*Results display */}
            {results && results.length > 0 && 
                <div className='grid grid-cols-2 md:grid-cols-6 xl:grid-cols-7 gap-3'>
                    {results.map((movie, index) => (
                        <MovieCard key={index} movie={movie}/>
                    ))}
                </div>
            }

            {/*Show more button */}
            {totalPages && page < totalPages && 
                <button onClick={() => setPage(prev => prev + 1)} className='bg-hover hover:bg-green-500 font-semibold px-3 py-1 rounded-md text-white'>Show more</button>
            }
        </div>
    )
}

export default FilmsPage