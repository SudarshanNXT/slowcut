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
import { IoMdClose, IoIosStar } from "react-icons/io";
import Loading from '../components/Loading.jsx';

const FilmPage = () => {
    const { id } = useParams()
    const [movieData, setMovieData] = useState(null);
    const [filter, setFilter] = useState('cast');
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)
    const [imageClick, setImageClick] = useState(false)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

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
                    setMovieData(data);
                    setLoading(false)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getMovieDetails()
        // setMovieData(sampleFilmData)
        // setLoading(false)
    }, [id])

    return  loading ? (
        <div className='flex justify-center items-center min-h-[calc(90vh-65px)]'>
            <Loading />
        </div>
    ) : (
        <>
            <SignInForm flag={flag} setFlag={setFlag}/>

            <CreateAccount createAccount={createAccountForm} setCreateAccount={setCreateAccountForm}/>

            {/*Full image click */}
            <div className={`fixed inset-0 h-full w-full flex items-center justify-center px-3 ${imageClick ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
                <button onClick={() => setImageClick(false)} className='absolute top-2 right-2 text-xl text-white hover:bg-gray-500 bg-gray-600 h-fit w-fit rounded-full p-2'>
                    <IoMdClose size={30}/>
                </button>

                <img className="w-auto max-h-[80vh] aspect-[2/3] rounded-md object-cover" src={`https://image.tmdb.org/t/p/original/${movieData.movie_data.poster_path}`} alt={movieData.movie_data.title} />
            </div>
            
            {/*Desktop */}
            <div className='hidden md:grid grid-cols-4 pt-4 gap-x-6'>
                {movieData.movie_data.poster_path ? (
                    <button onClick={() => setImageClick(true)} className='h-fit w-fit'>
                        <img className='h-[345px] rounded-md' src={`https://image.tmdb.org/t/p/original/${movieData.movie_data.poster_path}`} alt={movieData.movie_data.title} />
                    </button>
                ) : (
                    <div className='w-[230px] h-[345px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-2xl text-center rounded-md'>{movieData.movie_data.title}</div>
                )}
                
                
                <div className='col-span-2 space-y-3'>
                    <div className='text-white text-3xl font-bold flex items-end'>
                        {movieData.movie_data.title}
                        <div className='font-normal text-base ml-3'>{movieData.movie_data.release_date.slice(0, 4)}</div>
                        {movieData.director && <div className='font-normal text-base ml-3 text-gray-300'>Directed by <Link className='text-gray-200 underline hover:text-blue-500' to={`/person/${movieData.director.id}`}>{movieData.director.name}</Link></div>}
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

            {/*Mobile */}
            <div className='flex md:hidden flex-col p-3 space-y-3'>
                <div className='flex justify-between'>
                    <div className='flex flex-col items-center justify-center text-white text-2xl font-bold'>
                        {movieData.movie_data.title}
                        <div className='mt-3 font-normal text-base text-gray-300'>{movieData.movie_data.release_date.slice(0, 4)} {movieData.director && ' - DIRECTED BY'}</div>
                        {movieData.director && <div className='text-base text-gray-200 font-semibold'><Link className='text-gray-200 hover:text-blue-500' to={`/person/${movieData.director.id}`}>{movieData.director.name}</Link></div>}
                    </div>

                    {movieData.movie_data.poster_path ? 
                        <button onClick={() => setImageClick(true)} className='h-fit w-fit flex-shrink-0'>
                            <img className='h-[180px] rounded-md' src={`https://image.tmdb.org/t/p/original/${movieData.movie_data.poster_path}`} alt={movieData.movie_data.title} />
                        </button> 
                        : 
                        <div className='w-[120px] h-[180px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-lg text-center rounded-md'>{movieData.movie_data.title}</div>
                    }
                    
                </div>
                
                <div>
                    <div className='text-gray-300 font-semibold'>{movieData.movie_data.tagline}</div>
                    <div className='text-gray-300 mt-3'>{movieData.movie_data.overview}</div>
                </div>

                {localStorage.getItem('userInfo') ? (
                    <BackendBox id={id} movieData={movieData}/>
                ) : (
                    <div className='bg-light text-gray-300 h-fit rounded-md text-center'>
                        <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full'>Sign in to log, rate or review</button>
                        <button onClick={() => setCreateAccountForm(true)} className='py-1 w-full'>Create account</button>
                    </div>
                )}

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
        </>
    )
    
}

export default FilmPage