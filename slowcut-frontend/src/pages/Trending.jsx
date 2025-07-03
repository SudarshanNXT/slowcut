import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/cards/ReviewCard.jsx';
import ListCard from '../components/cards/ListCard.jsx'
import { MdImageNotSupported } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const Trending = () => {
     const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [followingReviews, setFollowingReviews] = useState([]);
    const [followingLists, setFollowingLists] = useState([]);
    const [topLists, setTopLists] = useState([]);
    const [trendingReviews, setTrendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch trending reviews
                const trendingReviewsResponse = await fetch(`${apiBaseUrl}/feed/top-reviews`);
                const trendingReviewsData = await trendingReviewsResponse.json();
                
                // Fetch following reviews
                const reviewsResponse = await fetch(`${apiBaseUrl}/feed/following/reviews`);
                const reviewsData = await reviewsResponse.json();
                
                // Fetch following lists
                const followingListsResponse = await fetch(`${apiBaseUrl}/feed/following/lists`);
                const followingListsData = await followingListsResponse.json();
                
                // Fetch top lists
                const topListsResponse = await fetch(`${apiBaseUrl}/feed/top-lists`);
                const topListsData = await topListsResponse.json();
                
                setTrendingReviews(trendingReviewsData.trendingReviews || []);
                setFollowingReviews(reviewsData.reviews || []);
                setFollowingLists(followingListsData.lists || []);
                setTopLists(topListsData.topLists || []);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load trending content');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Enhanced ReviewCard component for trending
    const TrendingReviewCard = ({ review, showEngagement = false }) => {
        const imageUrl = review.movie.image ? `https://image.tmdb.org/t/p/w500/${review.movie.image}` : '';
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        };
        
        return (
            <div className='flex space-x-3 border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors'>
                <Link to={`/film/${review.movie.id}`} className='relative group rounded-md flex-shrink-0 h-fit'>
                    {imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={review.movie.title} 
                            className='h-[100px] w-[70px] rounded-md object-cover'
                        />
                    ) : (
                        <div className='h-[100px] w-[70px] bg-gray-600 text-gray-300 flex items-center justify-center rounded-md'>
                            <MdImageNotSupported size={24}/>
                        </div>
                    )}
                    <div className='absolute opacity-0 group-hover:opacity-100 inset-0 border-2 border-blue-500 rounded-md'></div>
                </Link>
                <div className='flex flex-col space-y-2 flex-1'>
                    <Link to={`/film/${review.movie.id}`} className='text-lg font-bold text-white hover:text-blue-500 line-clamp-1'>
                        {review.movie.title}
                    </Link>
                    <div className='text-sm text-gray-400'>{formatDate(review.created_at)}</div>
                    <div className='text-sm text-gray-300 line-clamp-3'>{review.body || review.content}</div>
                    <div className='flex items-center justify-between'>
                        <Link to={`/${review.creator}`} className='flex items-center gap-x-2 text-sm text-gray-400 hover:text-gray-200'>
                            <FaUserCircle size={14}/>
                            <span>{review.creator}</span>
                        </Link>
                        {showEngagement && (
                            <div className='flex items-center gap-x-3 text-xs text-gray-500'>
                                {review.likes && <span>{review.likes} likes</span>}
                                {review.comments && <span>{review.comments} comments</span>}
                                {review.totalEngagement && <span>{review.totalEngagement} total</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Enhanced ListCard component for trending
    const TrendingListCard = ({ list, showCreator = false }) => {
        const maxItemsToShow = 4;
        const itemsToShow = list.list_items.slice(0, maxItemsToShow);
        
        return (
            <div className='border border-gray-700 rounded-lg p-4 bg-gray-800 hover:bg-gray-750 transition-colors'>
                <div className='flex flex-col space-y-3'>
                    <div className='relative h-[100px] w-full'>
                        {itemsToShow.map((list_item, inner_index) => (
                            list_item && list_item.movie ? (
                                list_item.movie.image ? (
                                    <img 
                                        key={inner_index}
                                        src={`https://image.tmdb.org/t/p/w500/${list_item.movie.image}`}
                                        alt={list_item.movie.title}
                                        className="absolute h-[100px] w-[70px] rounded-md object-cover border-2 border-gray-600"
                                        style={{
                                            left: `${inner_index * 35}px`,
                                            zIndex: itemsToShow.length - inner_index,
                                        }}
                                    />
                                ) : (
                                    <div 
                                        key={inner_index}
                                        className="absolute h-[100px] w-[70px] bg-gray-600 border-2 border-gray-600 text-gray-300 flex items-center justify-center rounded-md"
                                        style={{
                                            left: `${inner_index * 35}px`,
                                            zIndex: itemsToShow.length - inner_index,
                                        }}
                                    >
                                        <MdImageNotSupported size={24}/>
                                    </div>
                                )
                            ) : (
                                <div 
                                    key={inner_index}
                                    className="absolute h-[100px] w-[70px] bg-gray-800 border-2 border-gray-600 text-gray-300 flex items-center justify-center rounded-md"
                                    style={{
                                        left: `${inner_index * 35}px`,
                                        zIndex: itemsToShow.length - inner_index,
                                    }}
                                />
                            )
                        ))}
                    </div>
                    
                    <div className='space-y-2'>
                        <Link to={`/list/${list._id}`} className='text-lg font-bold text-white hover:text-blue-500 line-clamp-1 block'>
                            {list.name}
                        </Link>
                        {list.description && (
                            <div className='text-sm text-gray-400 line-clamp-2'>{list.description}</div>
                        )}
                        {showCreator && (
                            <Link to={`/${list.creator}`} className='flex items-center gap-x-2 text-sm text-gray-400 hover:text-gray-200'>
                                <FaUserCircle size={14}/>
                                <span>{list.creator}</span>
                            </Link>
                        )}
                        <div className='flex items-center gap-x-4 text-sm text-gray-500'>
                            <span>{list.list_items.length} {list.list_items.length === 1 ? 'film' : 'films'}</span>
                            {list.likes && list.likes.length > 0 && (
                                <span>{list.likes.length} {list.likes.length === 1 ? 'like' : 'likes'}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
                <div className='text-white text-lg'>Loading trending content...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
                <div className='text-red-400 text-lg'>{error}</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-900 text-white'>
            {/* Header */}
            <div className='bg-gray-800 border-b border-gray-700 py-6'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h1 className='text-4xl font-bold text-white'>Trending</h1>
                    <p className='text-gray-400 mt-2'>Discover what's popular in the community</p>
                </div>
            </div>

            {/* Content in Rows */}
            <div className='max-w-7xl mx-auto px-4 py-8 space-y-12'>
                
                {/* Trending Reviews Section - TOP */}
                {trendingReviews.length > 0 && (
                    <div className='space-y-6'>
                        <div className='flex items-center gap-x-3'>
                            <h2 className='text-2xl font-bold text-white'>🔥 Trending Reviews</h2>
                            <div className='px-2 py-1 bg-red-600 text-white text-xs rounded-full'>HOT</div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {trendingReviews.map((review) => (
                                <TrendingReviewCard key={review._id} review={review} showEngagement={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Lists Section - TRENDING */}
                {topLists.length > 0 && (
                    <div className='space-y-6'>
                        <div className='flex items-center gap-x-3'>
                            <h2 className='text-2xl font-bold text-white'>📈 Top Lists</h2>
                            <div className='px-2 py-1 bg-yellow-600 text-white text-xs rounded-full'>TRENDING</div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {topLists.map((list) => (
                                <TrendingListCard key={list._id} list={list} showCreator={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Following Reviews Section */}
                {followingReviews.length > 0 && (
                    <div className='space-y-6'>
                        <h2 className='text-2xl font-bold text-white'>Following Reviews</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {followingReviews.map((review) => (
                                <TrendingReviewCard key={review._id} review={review} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Following Lists Section */}
                {followingLists.length > 0 && (
                    <div className='space-y-6'>
                        <h2 className='text-2xl font-bold text-white'>Following Lists</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                            {followingLists.map((list) => (
                                <TrendingListCard key={list._id} list={list} showCreator={true} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {followingReviews.length === 0 && followingLists.length === 0 && topLists.length === 0 && trendingReviews.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='text-gray-400 text-lg mb-4'>No trending content available</div>
                        <Link to='/discover' className='text-blue-400 hover:text-blue-300 text-lg'>
                            Discover new users and content →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trending;