import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';
import ResultCard from '../components/cards/ResultCard';
import sampleSearchResultData from '../data/sampleSearchResultData';
import Loading from '../components/Loading';

const SearchPage = () => {
    const location = useLocation();
    const { query, page } = useParams();
    const typeMatch = location.pathname.match(/\/search\/(films|person)\//);
    const type = typeMatch ? typeMatch[1] : null; 
    const currentPage = Number(page) || 1;
    const currentType = type || ''
    const [results, setResults] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    const [loading, setLoading] = useState(true)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if(query && query.length > 0){
            const fetchResultData = async () => {
                const response = await fetch(`${apiBaseUrl}/tmdb/search?query=${query}&page=${currentPage}&type=${currentType}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setResults(data.results)
                    setTotalPages(data.total_pages)
                    
                } else {
                    const error = await response.json()
                    console.error(error)
                }
            }
            fetchResultData()
            // setResults(sampleSearchResultData.results)
            // setTotalPages(sampleSearchResultData.total_pages)
        }
        setLoading(false)
    }, [query, page, type])

    return loading ? (
        <div className='flex justify-center items-center min-h-[calc(90vh-65px)]'>
            <Loading />
        </div>
    ) : (
        <div className='flex flex-col-reverse md:grid grid-cols-4 gap-x-4 text-gray-300 mx-2 md:mx-0'>
            <div className='col-span-3 mt-3 space-y-3'>
                <div className='uppercase border-b border-b-gray-300'>Showing matches for "{query}"</div>

                {/*Results */}
                <div className='space-y-1'>
                    {results && results.length > 0 ? (
                        results.map((result, index) => (
                            <ResultCard key={index} result={result} />
                        ))) : (
                            <div>There were no matches for your search term.</div>
                        )
                    }
                </div>

                {/*Show more and go back buttons */}
                <div className='flex items-center space-x-3'>
                    {totalPages && currentPage < totalPages && 
                        <Link className='bg-hover font-semibold hover:bg-green-500 px-3 py-1 rounded-md text-white' 
                            to={`/search${currentType ? `/${currentType}` : ''}/${query}/${currentPage + 1}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >Show more results
                        </Link>
                    }
                    {totalPages && currentPage > 1 && 
                        <Link className='bg-gray-500 font-semibold hover:bg-gray-400 px-3 py-1 rounded-md text-white' 
                            to={`/search${currentType ? `/${currentType}` : ''}/${query}/${currentPage - 1}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >Go back
                        </Link>
                    }
                </div>
            </div>

            {/*Filter buttons */}
            {results && 
                <div className='flex flex-col mt-3'>
                    <div className='uppercase border-b border-b-gray-300'>Show results for</div>
                    <div className='mt-2'></div>
                    <Link className={`${!location.pathname.includes('films') && !location.pathname.includes('person') ? 'bg-gray-600 text-white font-semibold' : ''} pl-2 py-1 rounded-md hover:text-blue-500`} to={`/search/${query}`}>All</Link>
                    <Link className={`${location.pathname === `/search/films/${query}` ? 'bg-gray-600 text-white font-semibold' : ''} pl-2 py-1 rounded-md hover:text-blue-500`} to={`/search/films/${query}`}>Films</Link>
                    <Link className={`${location.pathname === `/search/person/${query}` ? 'bg-gray-600 text-white font-semibold' : ''} pl-2 py-1 rounded-md hover:text-blue-500`} to={`/search/person/${query}`}>People</Link>
                </div>
            }
            
        </div>
    )
}

export default SearchPage