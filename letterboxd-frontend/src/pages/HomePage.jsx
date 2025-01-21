import React, { useEffect, useState } from 'react'
import sampleHomePageData from '../data/sampleHomePageData'
import ResultCard from '../components/cards/ResultCard'

const HomePage = () => {
    const [trendingData, setTrendingData] = useState(null)
    const [popularData, setPopularData] = useState(null)
    const [loading, setLoading] = useState(true)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getHomePageData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/tmdb/home_page`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setTrendingData(data.trending_data)
                    setPopularData(data.popular_data)
                    
                    // console.log(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        // getHomePageData()
        setTrendingData(sampleHomePageData.trending_data)
        setPopularData(sampleHomePageData.popular_data)
        setLoading(false)
    }, [])
    
    if(trendingData && popularData && !loading){
        return (
            <div>
                {/*Trending data */}
                <div className='flex'>
                    {trendingData.slice(0, 5).map((item, index) => (
                        <ResultCard key={index} result={item}/>
                    ))}
                </div>
                
                {/*Popular data */}
                <div className='flex'>
                    {popularData.slice(0, 5).map((item, index) => (
                        <ResultCard key={index} result={item}/>
                    ))}
                </div>
            </div>
        )
    } else if(!trendingData && !popularData && loading){
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div>error</div>
        )   
    }
}

export default HomePage