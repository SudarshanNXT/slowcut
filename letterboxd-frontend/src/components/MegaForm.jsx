import React, { useState, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import { IoMdClose, IoIosStar } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Form } from 'react-router-dom';

const MegaForm = ({ megaForm, setMegaForm, movieData, pre_rating, pre_like_status }) => {
    const [addFilmToDiary, setAddFilmToDiary] = useState(true)
    const [watchedBefore, setWatchedBefore] = useState(false)
    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(pre_rating);
    const [hoverRating, setHoverRating] = useState(null);
    const [likeStatus, setLikeStatus] = useState(pre_like_status);

    useEffect(() => {
        setRating(pre_rating);
    }, [pre_rating]);

    useEffect(() => {
        setLikeStatus(pre_like_status)
    }, [pre_like_status])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            
        } catch (error) {
            console.error(error.message)
        }
    }

    //className={`fixed inset-0 h-full w-full flex items-center justify-center ${megaForm ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}
    //className={`flex flex-col mx-4 w-full md:w-[300px] bg-light p-5 rounded-md relative ${megaForm ? '' : 'scale-50'} transition-all duration-200`}

    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${megaForm ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col mx-4 w-full md:w-[800px] bg-light rounded-md relative ${megaForm ? '' : 'scale-50'} transition-all duration-200`}>
                
                <div className='flex items-center justify-between border-b border-b-black p-3'>
                    <div className='text-white text-lg font-bold'>I watched...</div>
                    <button onClick={() => setMegaForm(false)} className=' text-xl text-gray-300'>
                        <IoClose size={30}/>
                    </button>
                </div>

                <Form onSubmit={ submitHandler }>
                    <div className='flex gap-x-6 p-5'>
                        <img className='h-[230px] rounded-md' src={`${movieData.image ? `https://image.tmdb.org/t/p/original/${movieData.image}` : '../images/no-image-1.png'}`} alt={movieData.title} />

                        <div className='flex flex-col w-full space-y-3 text-gray-300'>
                            <div className='text-gray-300 text-3xl font-bold flex items-end'>{movieData.title} <span className='font-normal text-base ml-2'>{movieData.year}</span></div>

                            <div className='flex justify-between items-center'>
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
                                                checked={watchedBefore} 
                                                onChange={() => setWatchedBefore(prev => !prev)} 
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
                                id="review_body"
                                value={reviewBody}
                                onChange={(e) => setReviewBody(e.target.value)}
                                className=' bg-gray-400 placeholder:text-gray-600 focus:bg-white focus:text-black focus:outline-none rounded-md p-2 w-full h-32'
                                placeholder="Enter review..."
                            ></textarea>

                            <div className='flex items-end w-fit self-end'>
                                <button onClick={() => setRating(null)} className=' pb-1'>{rating ? <IoMdClose size={22}/> : ''} </button>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <div className='w-full text-start text-sm text-white font-semibold'>Rating <span className='text-sm text-gray-300 font-normal'>{rating ? `${rating} out of 5` : ''}</span></div>
                                    <div className='flex items-center'>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button onMouseEnter={() => setHoverRating(num)} onMouseLeave={() => setHoverRating(null)} key={num}>
                                                <IoIosStar onClick={() => setRating(num)} value={num} size={32} className={`${(hoverRating || rating) >= num ? 'text-blue-400' : 'text-gray-900'}`}/>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/*Like Button */}
                                <div className='flex flex-col h-full ml-6'>
                                    <div>Like</div>
                                    {likeStatus ? (
                                        <button onClick={() => setLikeStatus(prev => !prev)}><FaHeart className='text-accent' size={32}/></button>
                                    ) : (
                                        <button onClick={() => setLikeStatus(prev => !prev)}><FaHeart className='text-gray-800 hover:text-gray-700' size={32}/></button>
                                    )}
                                </div>
                            </div>
                            
                            <div className='flex justify-end'>
                                <button className='w-fit bg-hover hover:bg-green-500 font-bold px-3 rounded-md text-lg'>Save</button>
                            </div>
                        </div>
                    </div>
                </Form>
                
            </div>
        </div>
    )
}

export default MegaForm

const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };