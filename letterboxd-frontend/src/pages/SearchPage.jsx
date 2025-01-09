import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const SearchPage = () => {
    const { query } = useParams();
    const [page, setPage] = useState(1)
    const [type, setType] = useState('')
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if(query && query.length > 0){
            const fetchResultData = async () => {
                const response = await fetch(`${apiBaseUrl}/tmdb/search?query=${query}&page=${page}&type=${type}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data);
                    
                } else {
                    const error = await response.json()
                    console.log(error)
                }
            }
            fetchResultData()
        }
    }, [query])

    return (
        <div>
            <div>search results for '{query}'</div>
        </div>
    )
}

export default SearchPage