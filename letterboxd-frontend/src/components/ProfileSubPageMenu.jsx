import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const ProfileSubPageMenu = ({ username }) => {
    const location = useLocation();

    return (
        <div className='border border-gray-500 rounded-md py-2 flex items-center justify-center text-gray-400 font-semibold'>
            <Link to={`/${username}`} className={`px-2 ${location.pathname === `/${username}` ? 'border-b-2 border-b-hover text-white' : ''}`}>Profile</Link>
            <Link to={`/${username}/watched`} className={`px-2 ${location.pathname === `/${username}/watched` ? 'border-b-2 border-b-hover text-white' : ''}`}>Watched</Link>
            <Link to={`/${username}/diary`} className={`px-2 ${location.pathname === `/${username}/diary` ? 'border-b-2 border-b-hover text-white' : ''}`}>Diary</Link>
            <Link to={`/${username}/reviews`} className={`px-2 ${location.pathname === `/${username}/reviews` ? 'border-b-2 border-b-hover text-white' : ''}`}>Reviews</Link>
            <Link to={`/${username}/watchlist`} className={`px-2 ${location.pathname === `/${username}/watchlist` ? 'border-b-2 border-b-hover text-white' : ''}`}>Watchlist</Link>
            <Link to={`/${username}/likes`} className={`px-2 ${location.pathname === `/${username}/likes` ? 'border-b-2 border-b-hover text-white' : ''}`}>Likes</Link>
            <Link to={`/${username}/lists`} className={`px-2 ${location.pathname === `/${username}/lists` ? 'border-b-2 border-b-hover text-white' : ''}`}>Lists</Link>
        </div>
    )
}

export default ProfileSubPageMenu