import React, { useEffect, useState } from 'react'
import ResultCard from '../components/ResultCard'

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
                // const arr = sortResults(sortingMetric, data.results)
                // const newResults = await getPredisplayData(arr)
                // displayResults(newResults)
                // setPagination(data.total_pages)
                // tempResults = arr
            }
        }
        getData()
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
        <div>
            {/*Filter buttons section */}
            <div className='flex space-x-3'>
                <button onClick={() => handleFilterClick('now_playing')} className={`border ${filter === 'now_playing' ? 'bg-blue-400' : ''}`}>Now Playing</button>
                <button onClick={() => handleFilterClick('popular')} className={`border ${filter === 'popular' ? 'bg-blue-400' : ''}`}>Popular</button>
                <button onClick={() => handleFilterClick('top_rated')} className={`border ${filter === 'top_rated' ? 'bg-blue-400' : ''}`}>Top Rated</button>
                <button onClick={() => handleFilterClick('upcoming')} className={`border ${filter === 'upcoming' ? 'bg-blue-400' : ''}`}>Upcoming</button>
            </div>

            {/*Sorting */}
            <div className="border">
                <div className="font-semibold text-gray-300 mb-1">Sort results by</div>
                <select id="sorting-metric-dropdown" className="rounded-lg py-2 font-semibold" onChange={(e) => handleSortingChange(e.target.value)}>
                    <option value="popularity_desc">Popularity (Descending)</option>
                    <option value="popularity_asc">Popularity (Ascending)</option>
                    <option value="rating_desc">Rating (Descending)</option>
                    <option value="rating_asc">Rating (Ascending)</option>
                    <option value="release_date_desc">Release Date (Descending)</option>
                    <option value="release_date_asc">Release Date (Ascending)</option>
                    <option value="title_desc">Title (A-Z)</option>
                    <option value="title_asc">Title (Z-A)</option>
                </select>
            </div>

            {/*Results display */}
            {results && results.length > 0 && 
                <div className='flex flex-wrap'>
                    {results.map((result, index) => (
                        <ResultCard key={index} result={result}/>
                    ))}
                </div>
            }

            {/*Show more button */}
            {totalPages && page < totalPages && 
                <button onClick={() => setPage(prev => prev + 1)} className='bg-blue-400'>Show more</button>
            }
        </div>
    )
}

export default FilmsPage