import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ResultCard from '../components/cards/ResultCard';

const SearchPage = () => {
    const { query, page, type } = useParams();
    const currentPage = Number(page) || 1;
    const currentType = type || ''
    const [results, setResults] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
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
                    // console.log(data);
                    
                } else {
                    const error = await response.json()
                    console.log(error)
                }
            }
            fetchResultData()
        }
    }, [query, page, type])

    return (
        <div>
            <div>search results for '{query}'</div>

            {/*Filter buttons */}
            {results && 
                <div className='space-x-2'>
                    <Link to={`/search/${query}`}>All</Link>
                    <Link to={`/search/films/${query}`}>Films</Link>
                    <Link to={`/search/person/${query}`}>People</Link>
                </div>
            }

            {/*Results */}
            <div className='space-y-1'>
                {results && results.length > 0 &&
                    results.map((result, index) => (
                        <ResultCard key={index} result={result} />
                    ))
                }
            </div>
            
            {/*Show more and go back buttons */}
            {totalPages && currentPage < totalPages && 
                <div>
                    <Link to={`/search${currentType ? `/${currentType}` : ''}/${query}/${currentPage + 1}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >show more
                    </Link>
                </div>
            }
            {totalPages && currentPage > 1 && 
                <div>
                    <Link to={`/search${currentType ? `/${currentType}` : ''}/${query}/${currentPage - 1}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >go back
                    </Link>
                </div>
            }
        </div>
    )
}

export default SearchPage