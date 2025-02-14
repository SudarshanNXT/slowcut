import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { formatDate2 } from '../utils/formatDate';
import MegaForm from '../components/MegaForm';
import SignInForm from '../components/SignInForm';
import CreateAccount from '../components/CreateAccount';

const ReviewPage = () => {
    const { id } = useParams()
    const [review, setReview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const [update, setUpdate] = useState(0)
    const [megaForm, setMegaForm] = useState(false)

    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const requestUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        const getReview = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_review/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setAuthorized(requestUsername === data.creator)
                    setReview(data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getReview()
    }, [id, update])

    const handleDeleteReview = async () => {
        const confirm = window.confirm('Are you sure you want to delete this review?')
        if(!confirm) return
        
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_review/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                navigate(-1)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return loading ? (
        <div>Loading</div>
    ) : (
        <>
            <SignInForm flag={flag} setFlag={setFlag}/>

            <CreateAccount createAccount={createAccountForm} setCreateAccount={setCreateAccountForm}/>

            <MegaForm 
                megaForm={megaForm}
                setMegaForm={setMegaForm}
                movieData={review.movie}
                pre_rating={review.rating}
                pre_like_status={review.like_status}
                setUpdate={setUpdate}
                edit={true}
                entry_id={review.rewatch_entry_id}
                pre_rewatch_status={review.rewatch_status}
                edit_review={true}
                pre_review={review.body}
                review_id={review._id}
            />

            <div className='flex flex-col md:flex-row gap-x-6 mt-3 mx-3 md:mx-0 space-y-3 md:space-y-0'>
                <div className='relative group rounded-md flex-shrink-0 mx-auto'>
                    {review.movie.image ? <img className='h-[234px] rounded-md' src={`https://image.tmdb.org/t/p/original/${review.movie.image}`} alt={review.movie.title} />
                    : <div className='h-[234px] w-[156px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-2xl text-center rounded-md'>{review.movie.title}</div>}
                    <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-4 border-hover rounded-md '></div>
                </div>

                <div className='space-y-3 flex-1'>
                    <div className='text-gray-300 flex items-center border-b border-b-gray-500 pb-2'>
                        <FaUserCircle className='mr-2' size={23}/> 
                        Review by <Link to={`/${review.creator}`} className='text-white hover:text-blue-500 ml-2 font-semibold'>{review.creator}</Link>
                    </div>

                    <div className='flex items-end'>
                        <Link to={`/film/${review.movie.id}`} className='text-white text-2xl font-bold mr-2 hover:text-blue-500'>{review.movie.title}</Link>
                        <span className='text-gray-400 '>{review.movie.release_date.slice(0, 4)}</span>
                    </div>

                    {(review.rating || review.like_status) &&
                        <div className='flex items-center space-x-3'>
                            {review.rating && 
                                <div className='flex items-center'>
                                    {[1,2,3,4,5].map((num) => (
                                        num <= review.rating ? <IoIosStar size={20} key={num} className='text-blue-500'/> : ''
                                    ))}
                                </div>
                            }
                            {review.like_status && 
                                <FaHeart className='text-accent'/>
                            }
                        </div>
                    }

                    <div className='text-gray-400'>{formatDate2(review.created_at)}</div>

                    <div className='text-white'>{review.body}</div>
                </div>

                {authorized &&
                    <div className='flex flex-col text-center w-[246px] bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0 mx-auto'>
                        <button onClick={() => setMegaForm(true)} className='text-center border-b border-b-black py-2 hover:text-white'>Edit this review</button>
                        <button onClick={() => handleDeleteReview()} className='text-center border-b border-b-black py-2 hover:text-white'>Delete this review</button>
                    </div>
                }
                {!localStorage.getItem('userInfo') &&
                    <div className='flex flex-col text-center w-[246px] bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0 mx-auto'>
                        <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full'>Sign in to create lists</button>
                        <button onClick={() => setCreateAccountForm(true)} className='py-1 w-full'>Create account</button>
                    </div>
                }
            </div>
        </>
    )
}

export default ReviewPage