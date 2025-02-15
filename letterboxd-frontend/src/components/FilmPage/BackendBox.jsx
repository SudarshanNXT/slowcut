import React, { useEffect, useState } from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdWatchLater } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import MegaForm from '../MegaForm';
import AddToListForm from '../AddToListForm';

const BackendBox = ({ id, movieData }) => {
    const [likeStatus, setLikeStatus] = useState(false);
    const [watchStatus, setWatchStatus] = useState(false);
    const [watchlistStatus, setWatchlistStatus] = useState(false);
    const [diaryStatus, setDiaryStatus] = useState(false);
    const [reviewStatus, setReviewStatus] = useState(false);
    const [listStatusArr, setListStatusArr] = useState(null);
    const [addToList, setAddToList] = useState(false);
    
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [megaForm, setMegaForm] = useState(false);
    const [addToListForm, setAddToListForm] = useState(false);
    const [update, setUpdate] = useState(1);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const movieDataObj = {
        image: movieData.movie_data.poster_path, 
        title: movieData.movie_data.title, 
        release_date: movieData.movie_data.release_date,
        genres: movieData.movie_data.genres,
        id: movieData.movie_data.id
    }

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const getMovieStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/movie_status?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                if(response.ok){
                    const data = await response.json()
                    setLikeStatus(data.liked_movie_status)
                    setWatchStatus(data.watch_status)
                    setWatchlistStatus(data.watchlist_status)
                    setDiaryStatus(data.diary_status)
                    setReviewStatus(data.review_status)
                    setListStatusArr(data.list_status_arr)
                    setRating(data.rating_status)
                }
            } 
            getMovieStatus()
        }
    }, [update])

    const addMovieToProfile = async (field, rating = null) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: movieData.movie_data.title,
                    id: movieData.movie_data.id,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    rating: rating
                })
            })
            if(response.ok){
                const data = await response.json()
                if(field === 'liked'){
                    setLikeStatus(true)
                } else if(field === 'watched'){
                    setWatchStatus(true)
                } else if(field === 'watchlist'){
                    setWatchlistStatus(true)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const removeMovieFromProfile = async (field) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_profile/${field}?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                if(field === 'liked'){
                    setLikeStatus(false)
                } else if(field === 'watched'){
                    setWatchStatus(false)
                    setRating(null)
                } else if(field === 'watchlist'){
                    setWatchlistStatus(false)
                }
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
                    id: id,
                    title: movieData.movie_data.title,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    rewatch: true
                })
            })
            if(response.ok){
                const data = await response.json()
                setDiaryStatus(true)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
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
                    movie_id: id,
                    title: movieData.movie_data.title,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    body: reviewBody
                })
            })
            if(response.ok){
                const data = await response.json()
                setReviewStatus(true)
                setReviewBody('')
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleRatingChange = (num) => {
        const rating = num
        setRating(rating)
        addMovieToProfile('watched', rating)
    }

    const handleDeleteRating = () => {
        setRating(null)
        addMovieToProfile('watched')
    }

    return (
        <>
            <MegaForm 
                megaForm={megaForm}
                setMegaForm={setMegaForm}
                movieData={movieDataObj}
                pre_rating={rating}
                pre_like_status={likeStatus}
                setUpdate={setUpdate}
            />

            <AddToListForm 
                addToListForm={addToListForm} 
                setAddToListForm={setAddToListForm} 
                movieData={movieDataObj}
                listStatusArr={listStatusArr}
                setUpdate={setUpdate}
            />

            <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md p-1'>
                
                {/*Watch, Like, Watchlist */}
                <div className='flex h-[69px] border-b border-b-black pb-1'>
                    {watchStatus ? (
                        <button onClick={() => removeMovieFromProfile('watched')} className='flex flex-col items-center flex-1 self-end group'>
                            <IoEyeSharp className='text-hover' size={45}/>
                            <div className='group-hover:hidden'>Watched</div>
                            <div className='hidden group-hover:block text-white'>Remove</div>
                        </button>
                    ) : (
                        <button onClick={() => addMovieToProfile('watched')} className='flex flex-col items-center flex-1 self-end group'>
                            <IoEyeOutline size={45}/>
                            <div className='group-hover:text-white'>Watch</div>
                        </button>
                    )}

                    {likeStatus ? (
                        <button onClick={() => removeMovieFromProfile('liked')} className='flex flex-col items-center flex-1 self-end group'>
                            <FaHeart className='text-accent' size={35}/>
                            <div className='mt-1 group-hover:hidden'>Liked</div>
                            <div className='hidden mt-1 group-hover:block text-white'>Remove</div>
                        </button>
                    ) : (
                        <button onClick={() => addMovieToProfile('liked')} className='flex flex-col items-center flex-1 self-end group'>
                            <FaRegHeart size={35}/>
                            <div className='mt-1 group-hover:text-white'>Like</div>
                        </button>
                    )}

                    {watchlistStatus ? (
                        <button onClick={() => removeMovieFromProfile('watchlist')} className='flex flex-col items-center flex-1 self-end group'>
                            <MdWatchLater className='text-blue-400' size={35}/>
                            <div className='mt-1 group-hover:hidden'>Watchlisted</div>
                            <div className='hidden mt-1 group-hover:block text-white'>Remove</div>
                        </button>
                    ) : (
                        <button onClick={() => addMovieToProfile('watchlist')} className='flex flex-col items-center flex-1 self-end group'>
                            <MdOutlineWatchLater size={35}/>
                            <div className='mt-1 group-hover:text-white'>Watchlist</div>
                        </button>
                    )}
                </div>

                {/*Rating */}
                <div className='flex flex-col items-center py-1 border-b border-b-black'>
                    <div className='text-center text-sm'>{rating ? 'Rated' : 'Rate'}</div>
                    <div className='flex justify-center items-center w-full relative'>
                        {rating && <button onClick={() => handleDeleteRating()} className='md:opacity-0 hover:opacity-100 md:absolute left-3 transition-opacity duration-200'><IoMdClose size={22}/></button>}
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button onMouseEnter={() => setHoverRating(num)} onMouseLeave={() => setHoverRating(null)} key={num}>
                                <IoIosStar onClick={() => handleRatingChange(num)} value={num} size={37} className={`${(hoverRating || rating) >= num ? 'text-blue-400' : 'text-gray-900'}`}/>
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={() => setMegaForm(true)} className='text-center border-b border-b-black py-2'>
                    {diaryStatus || reviewStatus ? 'Review or log again...' : 'Review or log...'}
                </button>

                <button onClick={() => setAddToListForm(true)} className='text-center py-2'>
                    Add to lists...
                </button>
            
            </div>
        </>
    )
}

export default BackendBox