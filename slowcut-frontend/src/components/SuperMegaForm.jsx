import React, { useEffect, useState } from 'react'
import { IoMdClose, IoIosStar } from "react-icons/io";
import { FaHeart, FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Form } from 'react-router-dom';
import SubSearchCard from '../components/cards/SubSearchCard'
import SuperMegaFormCard from './cards/SuperMegaFormCard';
import Loading from '../components/Loading.jsx';

const SuperMegaForm = ({ superMegaForm, setSuperMegaForm }) => {
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const [addFilmToDiary, setAddFilmToDiary] = useState(true)
    const [rewatch, setRewatch] = useState(false)
    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [likeStatus, setLikeStatus] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    {/*Grab pre-fill form data when movie is selected */}
    useEffect(() => {
        try {
            if(localStorage.getItem('userInfo') && selectedMovie){
                setLoading(true)
                const getMovieStatus = async () => {
                    const response = await fetch(`${apiBaseUrl}/profile/movie_status?id=${selectedMovie.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    })
                    if(response.ok){
                        const data = await response.json()
                        setLikeStatus(data.liked_movie_status ? data.liked_movie_status : false)
                        setRewatch(data.rewatch_status ? data.rewatch_status : false)
                        setRating(data.rating_status)
                        setLoading(false)
                    } else {
                        const error = await response.json()
                        throw new Error(error.message)
                    }
                } 
                getMovieStatus()
            }
        } catch (error) {
            console.error(error.message)
        }
    }, [selectedMovie])

    const handleSearch = async (e) => {
        e.preventDefault()
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
                    throw new Error(error.message)
                }
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            if(addFilmToDiary) await addDiaryEntry()
            likeStatus ? await addMovieToProfile('liked') : await removeMovieFromProfile('liked')
            await addReview()
            await addMovieToProfile('watched', rating)
            wipeState()
        } catch (error) {
            console.error(error.message)
        }
    }

    const addReview = async () => {
        try {
            if(reviewBody.length === 0) return
            const response = await fetch(`${apiBaseUrl}/profile/create_review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: selectedMovie.id,
                    title: selectedMovie.title,
                    image: selectedMovie.image,
                    genres: selectedMovie.genres,
                    release_date: selectedMovie.release_date,
                    body: reviewBody
                })
            })
            if(response.ok){
                const data = await response.json()
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const addDiaryEntry = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_diary_entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: selectedMovie.id,
                    title: selectedMovie.title,
                    image: selectedMovie.image,
                    genres: selectedMovie.genres,
                    release_date: selectedMovie.release_date,
                    rewatch: rewatch
                })
            })
            if(response.ok){
                const data = await response.json()
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const addMovieToProfile = async (field, rating = null) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: selectedMovie.title,
                    id: selectedMovie.id,
                    image: selectedMovie.image,
                    genres: selectedMovie.genres,
                    release_date: selectedMovie.release_date,
                    rating: rating
                })
            })
            if(response.ok){
                const data = await response.json()
                
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const removeMovieFromProfile = async (field) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_profile/${field}?id=${selectedMovie.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie)
    }

    const wipeState = () => {
        setSelectedMovie(null)
        setSuperMegaForm(false)
        setResults(null)
        setQuery('')
        setAddFilmToDiary(true)
        setReviewBody('')
    }
    
    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${superMegaForm ? 'bg-opacity-80 z-[100]' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col space-y-3 p-3 mx-4 md:mx-0 w-full md:w-[800px] bg-light rounded-md relative ${superMegaForm ? '' : 'scale-50'} transition-all duration-200`}>
                
                <div className='flex items-center justify-between border-b border-b-black p-3'>
                    <div className='text-white text-lg font-bold'>
                        {selectedMovie && <button onClick={() => setSelectedMovie(null)} className='uppercase mr-2 bg-gray-700 text-gray-200 hover:bg-gray-500 font-bold px-3 rounded-md'>Back</button>} 
                        Add to your films...
                    </div>
                    <button onClick={() => wipeState()} className=' text-xl text-gray-300'>
                        <IoMdClose size={30}/>
                    </button>
                </div>
                
                {selectedMovie ? (
                    <Form onSubmit={ submitHandler }>
                        <div className='flex flex-col md:flex-row gap-x-6 p-5'>
                            {selectedMovie.poster_path ? (
                                <img className='h-[180px] w-[120px] mx-auto rounded-md flex-shrink-0' src={`${`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}`} alt={selectedMovie.title} />
                            ) : (
                                <div className='h-[180px] w-[120px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-2xl text-center rounded-md flex-shrink-0'>{selectedMovie.title}</div>
                            )}
    
                            <div className='flex flex-col w-full space-y-5 text-gray-300'>
                                <div className='text-gray-300 text-3xl font-bold flex items-end'>{selectedMovie.title} <span className='font-normal text-base ml-2'>{selectedMovie.release_date.slice(0, 4)}</span></div>
    
                                <div className='flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between md:items-center'>
                                    {addFilmToDiary ? (
                                        <>
                                            <label className="flex items-center space-x-2 cursor-pointer w-fit">
                                                <input 
                                                    type="checkbox" 
                                                    checked={addFilmToDiary} 
                                                    onChange={() => setAddFilmToDiary(prev => !prev)} 
                                                    className="w-5 h-5"
                                                />
                                                <span>Watched on <span className='bg-gray-800 px-1 rounded-sm'>{formatDate()}</span></span>
                                            </label>
    
                                            <label className="flex items-center space-x-2 cursor-pointer w-fit">
                                                <input 
                                                    type="checkbox" 
                                                    checked={rewatch} 
                                                    onChange={() => setRewatch(prev => !prev)} 
                                                    className="w-5 h-5"
                                                />
                                                <span>I've watched this film before</span>
                                            </label>
                                        </>
                                    ) : (
                                        <label className="flex items-center space-x-2 cursor-pointer w-fit">
                                            <input 
                                                type="checkbox" 
                                                checked={addFilmToDiary} 
                                                onChange={() => setAddFilmToDiary(prev => !prev)} 
                                                className="w-5 h-5"
                                            />
                                            <span>Add film to your diary?</span>
                                        </label>
                                    )}
                                </div>
    
                                <textarea
                                    id={`textarea-${crypto.randomUUID()}`}
                                    value={reviewBody}
                                    onChange={(e) => setReviewBody(e.target.value)}
                                    className=' bg-gray-400 placeholder:text-gray-600 focus:bg-white focus:text-black focus:outline-none rounded-md p-2 w-full h-32'
                                    placeholder="Enter review..."
                                ></textarea>
    
                                <div className='flex items-end w-fit self-end'>
                                    <button type='button' onClick={() => setRating(null)} className=' pb-1'>{rating ? <IoMdClose size={22}/> : ''} </button>
                                    <div className='flex flex-col justify-center items-center w-full'>
                                        <div className='w-full text-start text-sm text-white font-semibold'>Rating <span className='text-sm text-gray-300 font-normal'>{rating ? `${rating} out of 5` : ''}</span></div>
                                        <div className='flex items-center'>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button onMouseEnter={() => setHoverRating(num)} onMouseLeave={() => setHoverRating(null)} key={num}>
                                                    <IoIosStar onClick={(e) => {e.preventDefault(), setRating(num)}} value={num} size={32} className={`${(hoverRating || rating) >= num ? 'text-blue-400' : 'text-gray-900'}`}/>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
    
                                    {/*Like Button */}
                                    <div className='flex flex-col h-full ml-6'>
                                        <div>Like</div>
                                        {likeStatus ? (
                                            <button onClick={(e) => {e.preventDefault(), setLikeStatus(prev => !prev)}}><FaHeart className='text-accent' size={32}/></button>
                                        ) : (
                                            <button onClick={(e) => {e.preventDefault(), setLikeStatus(prev => !prev)}}><FaHeart className='text-gray-800 hover:text-gray-700' size={32}/></button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className='flex justify-end'>
                                    <button type='submit' className='w-fit bg-hover hover:bg-green-500 font-bold px-3 rounded-md text-lg text-white'>Save</button>
                                </div>
                            </div>
                        </div>
                    </Form>
                ) : (
                    loading ? (
                        <div className='h-[392px] flex items-center justify-center w-full'>
                            <Loading />
                        </div>
                    ) : (
                        <div className='relative p-4 w-full'>
                            <Form onSubmit={handleSearch}>
                                
                                <div className='flex items-center bg-gray-400 focus-within:bg-white focus-within:text-black rounded-md p-2'>
                                    <input 
                                        id='super-form-search-query'
                                        type='text'
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder='Search for film...'
                                        className='focus:outline-none w-full h-full bg-transparent'
                                    />
                                    <button className='text-black self-end justify-center h-full'>
                                        <FaSearch />
                                    </button>
                                </div>
                            
                            </Form>

                            {results && results.length > 0 &&
                                <div className='absolute top-full left-0 mx-4 p-2 right-0 flex flex-col space-y-1 h-[350px] overflow-y-auto rounded-md bg-gray-800'>
                                    {results.map((movie, index) => (
                                        <SuperMegaFormCard
                                            key={index} 
                                            movie={movie} 
                                            handleMovieClick={handleMovieClick}
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
                    )
                )}
            </div>
        </div>
    )
}

export default SuperMegaForm

const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};