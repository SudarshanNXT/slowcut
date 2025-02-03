import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddToListCard from '../components/AddToListCard.jsx';
import sampleFilmData from '../data/sampleFilmData.js';
import MovieDetails from '../components/FilmPage/MovieDetails.jsx';
import Genres from '../components/FilmPage/Genres.jsx';
import Releases from '../components/FilmPage/Releases.jsx';
import Cast from '../components/FilmPage/Cast.jsx';
import Crew from '../components/FilmPage/Crew.jsx';
import SignInForm from '../components/SignInForm.jsx';
import CreateAccount from '../components/CreateAccount.jsx';
import BackendBox from '../components/FilmPage/BackendBox.jsx';

const FilmPage = () => {
    const { id } = useParams()
    const [movieData, setMovieData] = useState(null);
    const [filter, setFilter] = useState('cast');
    const [loading, setLoading] = useState(true);
    
    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/tmdb/movie_details?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    // console.log(data);
                    setMovieData(data);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
        // getMovieDetails()
        setMovieData(sampleFilmData)
        setLoading(false)
        // console.log(sampleFilmData);

        
    }, [id])

    if(movieData && !loading){
        return (
            <>
                <SignInForm flag={flag} setFlag={setFlag}/>

                <CreateAccount createAccount={createAccountForm} setCreateAccount={setCreateAccountForm}/>

                <div className='grid grid-cols-4 pt-4'>
                    <img className='h-[345px] rounded-md' src={`${movieData.movie_data.poster_path ? `https://image.tmdb.org/t/p/original/${movieData.movie_data.poster_path}` : '../images/no-image-1.png'}`} alt={movieData.movie_data.title} />
                    
                    <div className='col-span-2 space-y-3 mr-6'>
                        <div className='text-white text-3xl font-bold flex items-end'>
                            {movieData.movie_data.title}
                            <div className='font-normal text-base ml-3'>{movieData.movie_data.release_date.slice(0, 4)}</div>
                            <div className='font-normal text-base ml-3 text-gray-300'>Directed by <Link className='text-gray-200 underline hover:text-blue-500' to={`/person/${movieData.director.id}`}>{movieData.director.name}</Link></div>
                        </div>
                        
                        <div className='text-gray-300 font-semibold'>{movieData.movie_data.tagline}</div>
                        <div className='text-gray-300'>{movieData.movie_data.overview}</div>

                        {/*Filtered section */}
                        <div className=''>
                            <div className='flex space-x-4 text-hover font-semibold border-b border-b-gray-400'>
                                <button onClick={() => setFilter('cast')} className={`${filter === 'cast' ? 'text-white border-b' : ''}`}>Cast</button>
                                <button onClick={() => setFilter('crew')} className={`${filter === 'crew' ? 'text-white border-b' : ''}`}>Crew</button>
                                <button onClick={() => setFilter('details')} className={`${filter === 'details' ? 'text-white border-b' : ''}`}>Details</button>
                                <button onClick={() => setFilter('genres')} className={`${filter === 'genres' ? 'text-white border-b' : ''}`}>Genres</button>
                                <button onClick={() => setFilter('releases')} className={`${filter === 'releases' ? 'text-white border-b' : ''}`}>Releases</button>
                            </div>

                            {filter === 'cast' &&
                                <Cast cast={movieData.credits.cast}/>
                            }
                            {filter === 'crew' &&
                                <Crew grouped_crew={movieData.grouped_crew}/>
                            }
                            {filter === 'details' &&
                                <MovieDetails 
                                    production_companies={movieData.movie_data.production_companies} 
                                    origin_country={movieData.movie_data.origin_country[0]}
                                    original_language={movieData.movie_data.original_language}
                                    spoken_languages={movieData.movie_data.spoken_languages}
                                    alternative_titles={movieData.alternative_titles.titles}
                                />
                            }
                            {filter === 'genres' && (
                                <Genres genres={movieData.movie_data.genres} keywords={movieData.keywords.keywords}/>
                            )}
                            {filter === 'releases' && 
                                <Releases releases={movieData.releases}/>
                            }
                        </div>
                    </div>
                    

                    {localStorage.getItem('userInfo') ? (
                        <BackendBox id={id} movieData={movieData}/>
                    ) : (
                        <div className='bg-light text-gray-300 h-fit rounded-md text-center'>
                            <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full'>Sign in to log, rate or review</button>
                            <button onClick={() => setCreateAccountForm(true)} className='py-1 w-full'>Create account</button>
                        </div>
                    )}
                    
                </div>
            </>
        )
    } else if(!movieData && loading){
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div>error</div>
        )   
    }
    
}

export default FilmPage