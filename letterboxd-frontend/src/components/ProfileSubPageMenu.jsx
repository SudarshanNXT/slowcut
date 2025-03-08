import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const ProfileSubPageMenu = ({ username }) => {
    const location = useLocation();

    return (
        <>
            {/*Desktop navigation */}
            <div className='hidden md:flex items-center justify-center border border-gray-500 rounded-md py-2 text-gray-400 font-semibold'>
                <a href={`/${username}`} className={`px-2 ${location.pathname === `/${username}` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Profile</a>
                <a href={`/${username}/watched`} className={`px-2 ${location.pathname === `/${username}/watched` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Watched</a>
                <a href={`/${username}/diary`} className={`px-2 ${location.pathname === `/${username}/diary` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Diary</a>
                <a href={`/${username}/reviews`} className={`px-2 ${location.pathname === `/${username}/reviews` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Reviews</a>
                <a href={`/${username}/watchlist`} className={`px-2 ${location.pathname === `/${username}/watchlist` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Watchlist</a>
                <a href={`/${username}/likes`} className={`px-2 ${location.pathname === `/${username}/likes` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Likes</a>
                <a href={`/${username}/lists`} className={`px-2 ${location.pathname === `/${username}/lists` ? 'border-b-2 border-b-hover text-white' : ''} hover:text-white`}>Lists</a>
                
            </div>

            {/*Mobile navigation */}
            <div className='md:hidden flex justify-center'>
                <select 
                    className='mx-auto border border-gray-500 rounded-md py-2 bg-gray-400 font-semibold' 
                    onChange={(e) => {
                        if (e.target.value) {
                            window.location.href = e.target.value;
                        }
                    }}    
                    value={location.pathname}
                >
                    <option value={`/${username}`}>Profile</option>
                    <option value={`/${username}/watched`}>Watched</option>
                    <option value={`/${username}/diary`}>Diary</option>
                    <option value={`/${username}/reviews`}>Reviews</option>
                    <option value={`/${username}/watchlist`}>Watchlist</option>
                    <option value={`/${username}/likes`}>Likes</option>
                    <option value={`/${username}/lists`}>Lists</option>
                </select>
            </div>
        </>
    )
}

export default ProfileSubPageMenu