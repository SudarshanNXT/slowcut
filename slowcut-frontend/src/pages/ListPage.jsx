import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUserCircle, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { sortResults } from '../utils/sorting';
import ListMovieCard from '../components/cards/ListMovieCard';
import { formatDate2 } from '../utils/formatDate';
import SignInForm from '../components/SignInForm';
import CreateAccount from '../components/CreateAccount';
import Loading from '../components/Loading';

const ListPage = () => {
    const { id } = useParams()
    const [listData, setListData] = useState(null)
    const [display, setDisplay] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sortingMetric, setSortingMetric] = useState('list_order')
    const [filters, setFilters] = useState([])
    const [filter, setFilter] = useState('none')
    const [authorized, setAuthorized] = useState(false)
    const [update, setUpdate] = useState(5)

    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [likes, setLikes] = useState(0)
    const [isLiked, setIsLiked] = useState(false)

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const requestUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        const getListData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_list_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setAuthorized(requestUsername === data.list.creator)

                    //check if list is public/private and if request user is the owner
                    if(!data.list.is_public && data.list.creator !== requestUsername){
                        navigate('/error/not_found')
                    }
                    setListData(data)
                    setDisplay(data.movies)
                    setFilters(getFilters(data.movies)) 
                }
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getListData()

        // Fetch likes count and status
        const fetchLikes = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/likeandreview/${id}/like`, {
                    headers: token ? {
                        'Authorization': `Bearer ${token}`
                    } : {}
                })
                if(response.ok) {
                    const data = await response.json()
                    setLikes(data.likes || 0)
                    setIsLiked(data.isLiked || false)
                }
            } catch (error) {
                console.error('Error fetching likes:', error)
            }
        }
        fetchLikes()

        // Fetch comments
        const fetchComments = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/likeandreview/${id}/comment`)
                if(response.ok) {
                    const data = await response.json()
                    
                    // Transform comments to match your expected format
                    if (data.comments) {
                        const transformedComments = data.comments.map(comment => ({
                            username: comment.username,
                            content: comment.content,
                            timeAgo: formatTimeAgo(comment.timeAgo),
                            _id: comment._id
                        }))
                        setComments(transformedComments)
                    }
                }
            } catch (error) {
                console.error('Error fetching comments:', error)
            }
        }
        fetchComments()
    }, [id, update, token, requestUsername])

    // Helper function to format time ago
    const formatTimeAgo = (dateString) => {
        const now = new Date()
        const commentDate = new Date(dateString)
        const diffInSeconds = Math.floor((now - commentDate) / 1000)
        
        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    const getFilters = (arr) => {
        if (!arr || arr.length === 0) return []
        const genreNames = arr.flatMap(movie => 
            movie.genres ? movie.genres.map(genre => genre.name) : []
        );
        const uniqueGenres = [...new Set(genreNames)];
        return uniqueGenres;
    };

    const handleSortingChange = (e) => {
        setSortingMetric(e.target.value)
        setDisplay(sortResults(e.target.value, display))
    } 

    const handleFilterChange = (e) => {
        const selectedGenre = e.target.value
        setFilter(selectedGenre)
        if(selectedGenre === 'none') {
            setDisplay(listData.movies)
            return
        } 
        setDisplay(prev => prev.filter(movie => 
            movie.genres && movie.genres.some(genre => genre.name === selectedGenre)
        ))
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to delete this list?')
        if(!confirm) return

        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_list/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok){
                const data = await response.json()
                navigate(`/${requestUsername}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePublicToggle = async () => {
        const formData = {
            name: listData.list.name,
            description: listData.list.description,
            ranked: listData.list.ranked,
            is_public: !listData.list.is_public
        }

        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_list_data/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleLike = async () => {
        if(!token) {
            setFlag(true)
            return
        }

        try {
            const method = isLiked ? 'DELETE' : 'POST'
            const response = await fetch(`${apiBaseUrl}/likeandreview/${id}/like`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                const data = await response.json()
                // Update likes count and liked status based on API response
                setLikes(data.likes || 0)
                setIsLiked(data.isLiked || false)
            } else {
                const errorData = await response.json()
                console.error('Error with like/unlike:', errorData)
            }
        } catch (error) {
            console.error('Error with like/unlike:', error)
        }
    }

    const handleCommentDelete = async (commentId) => {
        if(!token) {
            setFlag(true)
            return
        }

        const confirmDelete = window.confirm('Are you sure you want to delete this comment?')
        if(!confirmDelete) return

        try {
            const response = await fetch(`${apiBaseUrl}/likeandreview/${id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                // Remove the comment from the local state
                setComments(comments.filter(comment => comment._id !== commentId))
            } else {
                const errorData = await response.json()
                console.error('Error deleting comment:', errorData)
            }
        } catch (error) {
            console.error('Error deleting comment:', error)
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if(!token) {
            setFlag(true)
            return
        }

        if (!newComment.trim()) {
            return
        }

        try {
            const response = await fetch(`${apiBaseUrl}/likeandreview/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            })
            if(response.ok) {
                const data = await response.json()
                // Add new comment to the beginning of the comments array
                const newCommentObj = {
                    username: requestUsername,
                    content: data.content || newComment,
                    timeAgo: 'Just now',
                    _id: data._id || Date.now()
                }
                setComments([newCommentObj, ...comments])
                setNewComment('')
            } else {
                const errorData = await response.json()
                console.error('Error posting comment:', errorData)
            }
        } catch (error) {
            console.error('Error posting comment:', error)
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: listData?.list.name || 'Movie List',
                text: `Check out this movie list: ${listData?.list.description || ''}`,
                url: window.location.href,
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => {
                    // Fallback if clipboard API is not supported
                    const textArea = document.createElement('textarea')
                    textArea.value = window.location.href
                    document.body.appendChild(textArea)
                    textArea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textArea)
                    alert('Link copied to clipboard!')
                })
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

            <div className='flex flex-col md:grid md:grid-cols-4 mt-3 md:gap-x-8 mx-3 md:mx-0'>
                <div className={`${localStorage.getItem('userInfo') && !authorized ? 'col-span-4' : 'col-span-3'} space-y-3`}>
                    <div className='flex items-center justify-between'>
                        <div className='text-gray-300 inline-flex items-center'>
                            <FaUserCircle className='mr-2' size={23}/> 
                            List by <Link to={`/${listData.list.creator}`} className='text-white hover:text-blue-500 ml-2 font-semibold'>{listData.list.creator}</Link>
                        </div>

                        <div className='text-gray-300'>Published {formatDate2(listData.list.created_at)}</div>
                    </div>

                    {/*Filtering/Sorting Section */}
                    <div className='flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 items-center border-y border-y-gray-300 text-gray-300 py-1'>
                        {filters.length > 0 && 
                            <div className='flex items-center w-fit'>
                                <div className='mr-1'>Filter by</div>
                                <select className='bg-transparent w-fit outline-none uppercase' value={filter} onChange={handleFilterChange}>
                                    <option className={`bg-gray-400 text-black w-fit`} value={'none'}>Genre</option>
                                    {filters.map((filter, index) => (
                                        <option 
                                            className={`bg-gray-400 text-black w-fit`} 
                                            key={index} 
                                            value={filter}>
                                            {filter}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                        
                        
                        <div className='flex items-center'>
                            <div className='mr-1'>Sort by</div>
                            <select className='bg-transparent w-fit outline-none uppercase' value={sortingMetric} onChange={handleSortingChange}>
                                <option className={`bg-gray-400 text-black`}  value="list_order">List Order</option>
                                <option className={`bg-gray-400 text-black`}  value="reverse_order">Reverse Order</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_desc">Release Date (desc)</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_asc">Release Date (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_asc">Title (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_desc">Title (desc)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className='space-y-2'>
                        <div className='text-xl font-bold text-white'>{listData.list.name}</div>
                        <div className='text-gray-300'>{listData.list.description}</div>
                    </div>

                    <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2'>
                        {display && display.length > 0 && display.map((movie, index) => (
                            <ListMovieCard key={index} movie={movie} ranked={listData.list.ranked}/>
                        ))}
                    </div>
                    {(!display || display.length === 0) &&
                        <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No films yet.</div>
                    }

                    {/* Comments Section */}
                    <div className='mt-8 border-t border-gray-700 pt-4'>
                        <h3 className='text-white text-lg font-semibold mb-4'>Comments</h3>
                        
                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className='mb-6'>
                            <div className='flex items-center mb-2'>
                                <FaUserCircle className='mr-2 text-gray-400' size={24}/>
                                <span className='text-gray-300'>{requestUsername || 'Guest'}</span>
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className='w-full bg-gray-800 text-white rounded p-3 mb-2'
                                placeholder='Add a comment...'
                                rows={3}
                            />
                            <button 
                                type='submit' 
                                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50'
                                disabled={!newComment.trim()}
                            >
                                POST
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className='space-y-4'>
                            {comments.length > 0 && comments.map((comment, index) => (
                                <div key={comment._id || index} className='border-b border-gray-700 pb-4'>
                                    <div className='flex items-center justify-between mb-1'>
                                        <div className='flex items-center'>
                                            <FaUserCircle className='mr-2 text-gray-400' size={20}/>
                                            <span className='font-semibold text-gray-300'>{comment.username}</span>
                                            <span className='text-gray-500 text-sm ml-2'>{comment.timeAgo}</span>
                                        </div>
                                        {/* Show delete button only if user is the comment author or list owner */}
                                        {(token && (comment.username === requestUsername || authorized)) && (
                                            <button
                                                onClick={() => handleCommentDelete(comment._id)}
                                                className='text-gray-500 hover:text-red-500 transition-colors'
                                                title='Delete comment'
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p className='text-gray-300 ml-8'>{comment.content}</p>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className='text-gray-500 text-center py-4'>No comments yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {authorized &&
                    <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0'>
                        <Link to={`/list/${id}/edit`} className='text-center border-b border-b-black py-2 hover:text-white'>Edit this list</Link>
                        <button onClick={(e) => handleDelete(e)} className='text-center border-b border-b-black py-2 hover:text-white'>Delete this list</button>
                        <button onClick={() => handlePublicToggle()} className='text-center border-b border-b-black py-2 hover:text-white'>Make this list {listData.list.is_public ? 'private' : 'public'}</button>
                        
                        {/* Like Button */}
                        <button 
                            onClick={handleLike} 
                            className='flex items-center justify-center space-x-2 py-2 border-b border-b-black hover:text-white'
                        >
                            {isLiked ? (
                                <FaHeart className='text-red-500' />
                            ) : (
                                <FaRegHeart />
                            )}
                            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
                        </button>
                        
                        {/* Share Button */}
                        <button 
                            onClick={handleShare}
                            className='py-2 hover:text-white'
                        >
                            Share
                        </button>
                    </div>
                }
                {!localStorage.getItem('userInfo') &&
                    <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0'>
                        <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full'>Sign in to create lists</button>
                        <button onClick={() => setCreateAccountForm(true)} className='py-1 border-b border-b-black w-full'>Create account</button>
                        
                        {/* Like Button for non-logged in users */}
                        <button 
                            onClick={() => setFlag(true)} 
                            className='flex items-center justify-center space-x-2 py-2 border-b border-b-black hover:text-white'
                        >
                            <FaRegHeart />
                            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
                        </button>
                        
                        {/* Share Button */}
                        <button 
                            onClick={handleShare}
                            className='py-2 hover:text-white'
                        >
                            Share
                        </button>
                    </div>
                }
                
                {/* Public Like and Share Section for all users */}
                {localStorage.getItem('userInfo') && !authorized &&
                    <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0'>
                        {/* Like Button */}
                        <button 
                            onClick={handleLike} 
                            className='flex items-center justify-center space-x-2 py-2 border-b border-b-black hover:text-white'
                        >
                            {isLiked ? (
                                <FaHeart className='text-red-500' />
                            ) : (
                                <FaRegHeart />
                            )}
                            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
                        </button>
                        
                        {/* Share Button */}
                        <button 
                            onClick={handleShare}
                            className='py-2 hover:text-white'
                        >
                            Share
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default ListPage