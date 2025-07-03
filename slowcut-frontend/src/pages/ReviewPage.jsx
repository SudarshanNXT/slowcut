import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaEdit } from "react-icons/fa";
import { IoIosStar, IoMdSend } from "react-icons/io";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { formatDate2 } from '../utils/formatDate';
import MegaForm from '../components/MegaForm';
import SignInForm from '../components/SignInForm';
import CreateAccount from '../components/CreateAccount';
import Loading from '../components/Loading';

const ReviewPage = () => {
    const { id } = useParams()
    const [review, setReview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)
    const [update, setUpdate] = useState(0)
    const [megaForm, setMegaForm] = useState(false)

    // Like states
    const [likes, setLikes] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)

    // Comment states
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)
    const [commentsLoading, setCommentsLoading] = useState(false)

    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const requestUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''
    const isLoggedIn = !!localStorage.getItem('userInfo')

    // Fetch review data
    const fetchReview = async () => {
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

    // Fetch like data
    const fetchLikeData = async () => {
        if (!review) return

        try {
            if (isLoggedIn) {
                const likeResponse = await fetch(`http://localhost:5000/api/review/${id}/like`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (likeResponse.ok) {
                    const likeData = await likeResponse.json()
                    setLikes(likeData.likes || 0)
                    setIsLiked(likeData.isLiked || false)
                }
            } else {
                // For non-logged in users, get counts endpoint if available
                const countsResponse = await fetch(`http://localhost:5000/api/review/${id}/counts`)
                if (countsResponse.ok) {
                    const countsData = await countsResponse.json()
                    setLikes(countsData.likes || 0)
                }
            }
        } catch (error) {
            console.error('Error fetching like data:', error)
        }
    }

    // Fetch comments
    const fetchComments = async () => {
        if (commentsLoading) return
        
        setCommentsLoading(true)
        try {
            const response = await fetch(`http://localhost:5000/api/review/${id}/comment`)
            if (response.ok) {
                const data = await response.json()
                setComments(data || [])
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setCommentsLoading(false)
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchReview()
    }, [id, update])

    // Fetch like data when review changes
    useEffect(() => {
        fetchLikeData()
    }, [id, review, token, isLoggedIn])

    // Fetch comments when showing comments section
    useEffect(() => {
        if (showComments && comments.length === 0) {
            fetchComments()
        }
    }, [showComments])

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

    const handleLike = async () => {
        if (!isLoggedIn) {
            setFlag(true)
            return
        }

        setLikeLoading(true)
        try {
            const method = isLiked ? 'DELETE' : 'POST'
            const response = await fetch(`http://localhost:5000/api/review/${id}/like`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setLikes(data.likes)
                setIsLiked(data.isLiked)
                
                // Real-time update: Fetch fresh like data to ensure consistency
                setTimeout(() => {
                    fetchLikeData()
                }, 100)
            }
        } catch (error) {
            console.error('Error handling like:', error)
            // Revert optimistic update on error
            fetchLikeData()
        } finally {
            setLikeLoading(false)
        }
    }

    const handleShowComments = () => {
        if (!showComments && comments.length === 0) {
            fetchComments()
        }
        setShowComments(!showComments)
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        if (!isLoggedIn) {
            setFlag(true)
            return
        }

        setCommentLoading(true)
        try {
            const response = await fetch(`http://localhost:5000/api/review/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ comment: newComment.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setNewComment('')
                
                // Real-time update: Fetch fresh comments data
                await fetchComments()
                
                // Also update like data in case comment count affects other metrics
                fetchLikeData()
            }
        } catch (error) {
            console.error('Error adding comment:', error)
        } finally {
            setCommentLoading(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        const confirm = window.confirm('Are you sure you want to delete this comment?')
        if (!confirm) return

        try {
            const response = await fetch(`http://localhost:5000/api/review/${id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                // Optimistic update
                setComments(prev => prev.filter(comment => comment._id !== commentId))
                
                // Real-time update: Fetch fresh comments data to ensure consistency
                setTimeout(() => {
                    fetchComments()
                }, 100)
                
                // Also update like data in case comment count affects other metrics
                fetchLikeData()
            }
        } catch (error) {
            console.error('Error deleting comment:', error)
            // Revert optimistic update on error
            fetchComments()
        }
    }

    const handleShare = async () => {
        const shareUrl = window.location.href
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Review of ${review.movie.title} by ${review.creator}`,
                    text: review.body.substring(0, 100) + '...',
                    url: shareUrl
                })
            } catch (error) {
                console.error('Error sharing:', error)
            }
        } else {
            // Fallback to copying to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl)
                alert('Link copied to clipboard!')
            } catch (error) {
                console.error('Error copying to clipboard:', error)
                // Final fallback - show the URL
                prompt('Copy this link:', shareUrl)
            }
        }
    }

    // Add a refresh function that can be called after major updates
    const refreshAllData = async () => {
        await Promise.all([
            fetchReview(),
            fetchLikeData(),
            showComments ? fetchComments() : Promise.resolve()
        ])
    }

    // Handle MegaForm close and refresh data
    const handleMegaFormClose = (shouldRefresh = false) => {
        setMegaForm(false)
        if (shouldRefresh) {
            setUpdate(prev => prev + 1) // This will trigger review refetch
            refreshAllData()
        }
    }
    
    return loading ? (
        <div className='flex justify-center items-center min-h-[calc(90vh-65px)]'>
            <Loading />
        </div>
    ) : (
        <>
            <SignInForm flag={flag} setFlag={setFlag}/>

            <CreateAccount createAccount={createAccountForm} setCreateAccount={setCreateAccountForm}/>

            <MegaForm 
                megaForm={megaForm}
                setMegaForm={handleMegaFormClose}
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

            <div className='max-w-4xl mx-auto'>
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

                        {/* Action Buttons */}
                        <div className='flex items-center space-x-6 pt-4 border-t border-gray-600'>
                            <button 
                                onClick={handleLike}
                                disabled={likeLoading}
                                className={`flex items-center space-x-1 hover:text-blue-500 transition-colors ${
                                    isLiked ? 'text-blue-500' : 'text-gray-400'
                                } ${likeLoading ? 'opacity-50' : ''}`}
                            >
                                {isLiked ? <BiSolidLike size={20} /> : <BiLike size={20} />}
                                <span>{likes}</span>
                            </button>

                            <button 
                                onClick={handleShowComments}
                                className='flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors'
                            >
                                <FaComment size={16} />
                                <span>{comments.length}</span>
                            </button>

                            <button 
                                onClick={handleShare}
                                className='flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors'
                            >
                                <FaShare size={16} />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>

                    {authorized &&
                        <div className='flex flex-col text-center w-[246px] bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0 mx-auto'>
                            <button onClick={() => setMegaForm(true)} className='flex items-center justify-center space-x-2 text-center border-b border-b-black py-2 hover:text-white'>
                                <FaEdit size={16} />
                                <span>Edit this review</span>
                            </button>
                            <button onClick={() => handleDeleteReview()} className='flex items-center justify-center space-x-2 text-center py-2 hover:text-white'>
                                <FaTrash size={16} />
                                <span>Delete this review</span>
                            </button>
                        </div>
                    }
                    {!localStorage.getItem('userInfo') &&
                        <div className='flex flex-col text-center w-[246px] bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0 mx-auto'>
                            <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full hover:text-white'>Sign in to create lists</button>
                            <button onClick={() => setCreateAccountForm(true)} className='py-1 w-full hover:text-white'>Create account</button>
                        </div>
                    }
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className='mx-3 md:mx-0 mt-6 bg-light rounded-md p-4'>
                        <h3 className='text-white text-lg font-semibold mb-4'>
                            Comments ({comments.length})
                        </h3>

                        {/* Add Comment Form */}
                        {isLoggedIn ? (
                            <form onSubmit={handleAddComment} className='mb-6'>
                                <div className='flex items-start space-x-3'>
                                    <FaUserCircle className='text-gray-400 mt-1' size={20} />
                                    <div className='flex-1'>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder='Write a comment...'
                                            className='w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none'
                                            rows={3}
                                        />
                                        <div className='flex justify-end mt-2'>
                                            <button
                                                type='submit'
                                                disabled={!newComment.trim() || commentLoading}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                                    !newComment.trim() || commentLoading
                                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                <IoMdSend size={16} />
                                                <span>{commentLoading ? 'Posting...' : 'Post'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className='mb-6 p-4 bg-gray-700 rounded-md text-center'>
                                <p className='text-gray-300 mb-3'>Sign in to join the conversation</p>
                                <div className='space-x-3'>
                                    <button 
                                        onClick={() => setFlag(true)}
                                        className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors'
                                    >
                                        Sign In
                                    </button>
                                    <button 
                                        onClick={() => setCreateAccountForm(true)}
                                        className='px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors'
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Comments List */}
                        {commentsLoading ? (
                            <div className='flex justify-center py-8'>
                                <Loading />
                            </div>
                        ) : comments.length > 0 ? (
                            <div className='space-y-4'>
                                {comments.map((commentItem) => (
                                    <div key={commentItem._id} className='flex items-start space-x-3 p-3 bg-gray-700 rounded-md'>
                                        <FaUserCircle className='text-gray-400 mt-1' size={20} />
                                        <div className='flex-1'>
                                            <div className='flex items-center space-x-2 mb-1'>
                                                <Link 
                                                    to={`/${commentItem.user.username}`}
                                                    className='text-blue-400 hover:text-blue-300 font-semibold text-sm'
                                                >
                                                    {commentItem.user.username}
                                                </Link>
                                                <span className='text-gray-500 text-xs'>
                                                    {formatDate2(commentItem.added_on)}
                                                </span>
                                            </div>
                                            <p className='text-gray-200 text-sm'>{commentItem.comment}</p>
                                        </div>
                                        {(commentItem.user.username === requestUsername) && (
                                            <button
                                                onClick={() => handleDeleteComment(commentItem._id)}
                                                className='text-gray-500 hover:text-red-400 transition-colors'
                                                title='Delete comment'
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-center py-8 text-gray-400'>
                                <FaComment size={32} className='mx-auto mb-2 opacity-50' />
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default ReviewPage