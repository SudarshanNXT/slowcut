import React, { useState, useEffect } from 'react'
import { FaCalendar, FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosStar, IoMdClose } from "react-icons/io";
import { BsArrowRepeat } from "react-icons/bs";
import { LuText } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import MegaForm from './MegaForm';

const DiaryEntry = ({ entry, i, j, month, authorized, setUpdate, userData }) => {
    const [rating, setRating] = useState(entry.rating);
    const [hoverRating, setHoverRating] = useState(null);
    const [likeStatus, setLikeStatus] = useState(entry.like_status);
    const [userLikeStatus, setUserLikeStatus] = useState(userData ? userData[i][j].user_like_status : null);
    const [userWatchStatus, setUserWatchStatus] = useState(userData ? userData[i][j].user_watch_status : null);
    const [megaForm, setMegaForm] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    useEffect(() => {
        setLikeStatus(entry.like_status)
        setRating(entry.rating)
        setUserLikeStatus(userData ? userData[i][j].user_like_status : null)
        setUserWatchStatus(userData ? userData[i][j].user_watch_status : null)
    }, [entry.like_status, entry.rating, userData])

    const handleRatingClick = async (e, field, num = null) => {
        e.preventDefault()
        setRating(num)
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: entry.movie.id,
                    rating: num
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

    const handleLikeClick = async (e, command, userClick = false) => {
        e.preventDefault()
        if(command === 'add'){
            userClick ? setUserLikeStatus(true) : setLikeStatus(true)
            try {
                const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/liked`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: entry.movie.id,
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
            
        } else {
            userClick ? setUserLikeStatus(false) : setLikeStatus(false)
            try {
                const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_profile/liked?id=${entry.movie.id}`, {
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
    }

    const handleDeleteClick = async () => {
        const confirm = window.confirm('Are you sure you want to delete this diary entry?')
        if (!confirm) return;
        
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_diary_entry/${entry._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleWatchClick = async (e, command) => {
        e.preventDefault()
        if(command === 'add'){
            setUserWatchStatus(true)
            try {
                const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/watched`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: entry.movie.id,
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
            
        } else {
            setUserWatchStatus(false)
            try {
                const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_profile/watched?id=${entry.movie.id}`, {
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
    }
    
    return (
        <>
            <MegaForm 
                megaForm={megaForm} 
                setMegaForm={setMegaForm} 
                movieData={entry.movie} 
                pre_rating={entry.rating} 
                pre_like_status={entry.like_status}
                setUpdate={setUpdate}
                edit={true}
                entry_id={entry._id}
                pre_rewatch_status={entry.rewatch}
            />

            {/*Large screens */}
            <div className='hidden lg:grid w-full lg:grid-cols-[68px_54px_497px_68px_92px_54px_80px_75px_92px] text-gray-300'>
                {/*Month column */}
                {j === 0 ? (
                    <div className='relative border-b border-b-gray-400 py-3'>
                        <FaCalendar className="text-gray-600 h-[55px] w-[67px]"/>
                        <span className="absolute left-0 right-0 top-7 flex flex-col items-center justify-center text-xs font-semibold text-gray-300">
                            {getMonthAbbreviation(month[0].added_on)}
                            <span>{month[0].added_on.slice(0, 4)}</span>
                        </span>
                    </div>
                ) : (
                    <div className='w-full h-full border-b border-b-gray-400 py-3'></div>
                )}

                {/*Day column */}
                <div className='text-3xl pl-3 flex items-center h-full py-3 border-b border-b-gray-400'>{getDayNumber(entry.added_on)}</div>

                {/*Film column */}
                <div className='pl-3 w-full flex items-center py-3 border-b border-b-gray-400 space-x-4'>
                    <div className='relative group h-full flex-shrink-0'>
                        {entry.movie.image ? <img src={`https://image.tmdb.org/t/p/w500/${entry.movie.image}`} alt={entry.movie.title} className='h-[58px] w-[40px] aspect-[2/3] rounded-sm object-cover'/> : (
                            <div className='h-[58px] aspect-[2/3] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-sm'></div>
                        )}
                        <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-sm'></div>
                    </div>
                    <Link to={`/film/${entry.movie.id}`} className='text-xl font-bold text-white hover:text-blue-500 text-nowrap truncate'>{entry.movie.title}</Link>
                </div>

                {/*Released column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center'>
                    {entry.movie.release_date.slice(0, 4)}
                </div>

                {/*Rating column */}
                <div className='py-3 border-b border-b-gray-400 flex items-center pl-3'>
                    <div className='flex items-center relative group'>
                        {[1,2,3,4,5].map((num, index) => (
                            <button onMouseEnter={() => setHoverRating(num)} onMouseLeave={() => setHoverRating(null)} key={index} disabled={!authorized}>
                                <IoIosStar onClick={(e) => handleRatingClick(e, 'watched', num)} value={num} className={`${(hoverRating || rating) >= num ? 'text-blue-400' : 'text-gray-900'}`} key={index} />
                            </button>
                        ))}
                        {rating && authorized &&
                            <button onClick={(e) => handleRatingClick(e, 'watched')} className='absolute pl-1 left-full hidden group-hover:block group/button'>
                                <IoMdClose />
                                <div className='hidden absolute group-hover/button:block bottom-full left-1/2 -translate-x-1/2 text-nowrap bg-gray-600 text-white rounded-md text-xs mb-1 p-1'>Remove rating</div>
                            </button>
                        }
                    </div>
                </div>

                {/*Like column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {likeStatus ? (
                        <button onClick={(e) => handleLikeClick(e, 'remove')} className='text-accent' disabled={!authorized}><FaHeart /></button>
                    ) : (
                        <button onClick={(e) => handleLikeClick(e, 'add')} className='text-gray-900' disabled={!authorized}><FaHeart /></button>
                    )}
                </div>  

                {/*Rewatch column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {entry.rewatch  && <BsArrowRepeat size={20}/>}
                </div>

                {/*Review column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {entry.review  && <Link to={`/review/${entry.review._id}`}><LuText size={20}/></Link>}
                </div>

                {/*Edit columnn */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center bg-gray-600'>
                    {authorized ? (
                        <>
                            <button onClick={() => setMegaForm(true)}><MdEdit size={25}/></button>
                            <button onClick={() => handleDeleteClick()}><RiDeleteBinLine size={25} className='ml-2 hover:text-red-500'/></button>
                        </>
                    ) : (
                        <>
                            {userLikeStatus ? (
                                <button onClick={(e) => handleLikeClick(e, 'remove', true)} className='text-accent' disabled={!localStorage.getItem('userInfo')}><FaHeart size={23}/></button>
                            ) : (
                                <button onClick={(e) => handleLikeClick(e, 'add', true)} className='text-gray-900' disabled={!localStorage.getItem('userInfo')}><FaHeart size={23}/></button>
                            )}
                            
                            {userWatchStatus ? (
                                <button onClick={(e) => handleWatchClick(e, 'remove')} className='text-blue-800 ml-2' disabled={!localStorage.getItem('userInfo')}><IoEye size={26}/></button>
                            ) : (
                                <button onClick={(e) => handleWatchClick(e, 'add')} className='text-gray-900 ml-2' disabled={!localStorage.getItem('userInfo')}><IoEye size={26}/></button>
                            )}
                        </>
                    )}
                    
                </div>
            </div>

            {/*Medium screens*/}
            <div className='hidden md:grid md:grid-cols-[68px_54px_309px_68px_54px_75px_92px] lg:hidden text-gray-300'>
                {/*Month column */}
                {j === 0 ? (
                    <div className='relative border-b border-b-gray-400 py-3'>
                        <FaCalendar className="text-gray-600 h-[55px] w-[67px]"/>
                        <span className="absolute left-0 right-0 top-7 flex flex-col items-center justify-center text-xs font-semibold text-gray-300">
                            {getMonthAbbreviation(month[0].added_on)}
                            <span>{month[0].added_on.slice(0, 4)}</span>
                        </span>
                    </div>
                ) : (
                    <div className='w-full h-full border-b border-b-gray-400 py-3'></div>
                )}

                {/*Day column */}
                <div className='text-3xl pl-3 flex items-center h-full py-3 border-b border-b-gray-400'>{getDayNumber(entry.added_on)}</div>

                {/*Film column */}
                <div className='pl-3 w-full flex items-center py-3 border-b border-b-gray-400 space-x-4'>
                    <div className='relative group h-full flex-shrink-0'>
                        {entry.movie.image ? <img src={`https://image.tmdb.org/t/p/w500/${entry.movie.image}`} alt={entry.movie.title} className='h-[58px] w-[40px] aspect-[2/3] rounded-sm object-cover'/> : (
                            <div className='h-[58px] aspect-[2/3] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-sm'></div>
                        )}
                        <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-sm'></div>
                    </div>
                    <Link to={`/film/${entry.movie.id}`} className='text-xl font-bold text-white hover:text-blue-500 text-nowrap truncate'>{entry.movie.title}</Link>
                </div>

                {/*Released column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center'>
                    {entry.movie.release_date.slice(0, 4)}
                </div>

                {/*Like column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {likeStatus ? (
                        <button onClick={(e) => handleLikeClick(e, 'remove')} className='text-accent' disabled={!authorized}><FaHeart /></button>
                    ) : (
                        <button onClick={(e) => handleLikeClick(e, 'add')} className='text-gray-900' disabled={!authorized}><FaHeart /></button>
                    )}
                </div>  

                {/*Review column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {entry.review  && <Link to={`/review/${entry.review._id}`}><LuText size={20}/></Link>}
                </div>

                {/*Edit columnn */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center bg-gray-600'>
                    {authorized ? (
                        <>
                            <button onClick={() => setMegaForm(true)}><MdEdit size={25}/></button>
                            <button onClick={() => handleDeleteClick()}><RiDeleteBinLine size={25} className='ml-2 hover:text-red-500'/></button>
                        </>
                    ) : (
                        <>
                            {userLikeStatus ? (
                                <button onClick={(e) => handleLikeClick(e, 'remove', true)} className='text-accent' disabled={!localStorage.getItem('userInfo')}><FaHeart size={23}/></button>
                            ) : (
                                <button onClick={(e) => handleLikeClick(e, 'add', true)} className='text-gray-900' disabled={!localStorage.getItem('userInfo')}><FaHeart size={23}/></button>
                            )}
                            
                            {userWatchStatus ? (
                                <button onClick={(e) => handleWatchClick(e, 'remove')} className='text-blue-800 ml-2' disabled={!localStorage.getItem('userInfo')}><IoEye size={26}/></button>
                            ) : (
                                <button onClick={(e) => handleWatchClick(e, 'add')} className='text-gray-900 ml-2' disabled={!localStorage.getItem('userInfo')}><IoEye size={26}/></button>
                            )}
                        </>
                    )}
                    
                </div>
            </div>

            {/*Mobile screens*/}
            <div className='grid grid-cols-[68px_54px_175px_54px_75px] md:hidden text-gray-300'>
                {/*Month column */}
                {j === 0 ? (
                    <div className='relative border-b border-b-gray-400 py-3'>
                        <FaCalendar className="text-gray-600 h-[55px] w-[67px]"/>
                        <span className="absolute left-0 right-0 top-7 flex flex-col items-center justify-center text-xs font-semibold text-gray-300">
                            {getMonthAbbreviation(month[0].added_on)}
                            <span>{month[0].added_on.slice(0, 4)}</span>
                        </span>
                    </div>
                ) : (
                    <div className='w-full h-full border-b border-b-gray-400 py-3'></div>
                )}

                {/*Day column */}
                <div className='text-3xl pl-3 flex items-center h-full py-3 border-b border-b-gray-400'>{getDayNumber(entry.added_on)}</div>

                {/*Film column */}
                <div className='pl-3 w-full flex items-center py-3 border-b border-b-gray-400 space-x-4'>
                    <div className='relative group h-full flex-shrink-0'>
                        {entry.movie.image ? <img src={`https://image.tmdb.org/t/p/w500/${entry.movie.image}`} alt={entry.movie.title} className='h-[58px] w-[40px] aspect-[2/3] rounded-sm object-cover'/> : (
                            <div className='h-[58px] aspect-[2/3] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-sm'></div>
                        )}
                        <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-sm'></div>
                    </div>
                    <Link to={`/film/${entry.movie.id}`} className='text-xl font-bold text-white hover:text-blue-500 text-nowrap truncate'>{entry.movie.title}</Link>
                </div>

                {/*Like column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {likeStatus ? (
                        <button onClick={(e) => handleLikeClick(e, 'remove')} className='text-accent' disabled={!authorized}><FaHeart /></button>
                    ) : (
                        <button onClick={(e) => handleLikeClick(e, 'add')} className='text-gray-900' disabled={!authorized}><FaHeart /></button>
                    )}
                </div>  

                {/*Review column */}
                <div className='py-3 border-b border-b-gray-400 flex justify-center items-center pl-6'>
                    {entry.review  && <Link to={`/review/${entry.review._id}`}><LuText size={20}/></Link>}
                </div>
            </div>
        </>
    )
}

export default DiaryEntry

function getMonthAbbreviation(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

function getDayNumber(dateString) {
    const date = new Date(dateString);
    return String(date.getUTCDate()).padStart(2, '0');
}

function findUserLikeIndex(userData, entry){
    for(const [i, month] of userData.entries()){
        for(const [j, item] of month.entries()){
            if(item.movie.id === entry.movie.id) return [i, j]
        }
    }
    return false
}