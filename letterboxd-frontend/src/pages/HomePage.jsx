import React, { useEffect, useState } from 'react'
import sampleHomePageData from '../data/sampleHomePageData'
import CreateAccount from '../components/CreateAccount'
import HomeMovieCard from '../components/cards/HomeMovieCard'
import Features from '../components/Features'
import Loading from '../components/Loading'

const HomePage = () => {
    const [trendingData, setTrendingData] = useState(null)
    const [popularData, setPopularData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [createAccount, setCreateAccount] = useState(false)

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
                    setLoading(false)
                }
            } catch (error) {
                console.error(error);
            }
        }
        
        getHomePageData()
        // setTrendingData(sampleHomePageData.trending_data)
        // setPopularData(sampleHomePageData.popular_data)
        // setLoading(false)
    }, [])

    return loading ? (
        <div className='z-10 absolute top-[65px] w-full h-5/6'>
            <div className='container mx-auto flex items-center justify-center h-full'>
                <Loading />
            </div>
        </div>
    ) : (
        <>
            <CreateAccount createAccount={createAccount} setCreateAccount={setCreateAccount}/>

            <div className='md:absolute md:left-0 md:top-0 w-full z-10 pb-6'>
                <div className='container mx-auto w-full'>
                    <div className='relative h-fit'>
                        <img src={`https://image.tmdb.org/t/p/original/${popularData[0].backdrop_path}`} alt={`${popularData[0].title}`} className='hidden md:block w-full shadow-[0_0_50px_20px_rgba(0,0,0,0.5)]'
                        style={{
                            maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                            WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                        }}/>
                        <img src={`https://image.tmdb.org/t/p/original/${popularData[0].backdrop_path}`} alt={`${popularData[0].title}`} className='block md:hidden w-full shadow-[0_0_50px_20px_rgba(0,0,0,0.5)]'
                        style={{
                            maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
                        }}/>
                        <div className="absolute inset-0 bg-secondary bg-opacity-60 z-20"></div>

                        <div className='absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white font-bold text-2xl md:text-4xl text-nowrap z-30 space-y-1'>
                            <div>Track films you've watched.</div>
                            <div>Save those you want to see.</div>
                            <div>Tell your friends what's good.</div>
                        </div>
                    </div>

                    <div className='space-y-6 mt-6 px-2 md:px-0'>
                        <div className='flex items-center justify-center'>
                            <button onClick={() => setCreateAccount(true)} className='bg-hover rounded-md text-white font-semibold hover:bg-green-500 px-4 py-1 text-xl'>Get started!</button>
                        </div>

                        <div className='text-gray-400 text-center'>The social network for film lovers.</div>

                        <div>
                            <div className='uppercase text-gray-400 border-b border-b-gray-400 mb-2'>Popular films</div>
                            <div className='hidden md:flex gap-x-3 lg:justify-center overflow-hidden'>
                                {popularData.slice(0, 6).map((movie, index) => (
                                    <HomeMovieCard movie={movie} key={index}/>
                                ))}
                            </div>
                            <div className='flex md:hidden gap-x-2 justify-center overflow-hidden'>
                                {popularData.slice(0, 4).map((movie, index) => (
                                    <HomeMovieCard movie={movie} key={index}/>
                                ))}
                            </div>
                        </div>

                        <Features />

                        <div>
                            <div className='uppercase text-gray-400 border-b border-b-gray-400 mb-2'>Trending films</div>
                            <div className='hidden md:flex gap-x-3 lg:justify-center overflow-hidden'>
                                {trendingData.slice(0, 6).map((movie, index) => (
                                    <HomeMovieCard movie={movie} key={index}/>
                                ))}
                            </div>
                            <div className='flex md:hidden gap-x-2 justify-center overflow-hidden'>
                                {trendingData.slice(0, 4).map((movie, index) => (
                                    <HomeMovieCard movie={movie} key={index}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage