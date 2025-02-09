import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ProfileHeader = ({ authorized, stats, username, setEditProfile }) => {
    return (
        <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-4'>
                <FaUserCircle className='text-gray-400' size={100}/>

                <div className='text-white text-2xl font-bold'>{username}</div>

                {authorized &&
                    <button onClick={() => setEditProfile(true)} className='uppercase font-semibold px-3 bg-gray-400 hover:bg-gray-300 text-white rounded-md text-sm'>Edit/Delete profile</button>
                }
            </div>

            <div className='flex'>
                <Link to={`/${username}/watched`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
                    <div className='font-bold text-2xl text-white'>{stats.watched}</div>
                    <div className='uppercase text-gray-300 text-xs  group-hover:text-blue-500'>Watched</div>
                </Link>
                <Link to={`/${username}/diary`} className='flex flex-col justify-center h-fit border-r border-r-gray-500 text-center px-2 group'>
                    <div className='font-bold text-2xl text-white'>{stats.this_year}</div>
                    <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>This year</div>
                </Link>
                <Link to={`/${username}/lists`} className='flex flex-col justify-center h-fit text-center px-2 group'>
                    <div className='font-bold text-2xl text-white'>{stats.lists}</div>
                    <div className='uppercase text-gray-300 text-xs group-hover:text-blue-500'>Lists</div>
                </Link>
            </div>
        </div>
    )
}

export default ProfileHeader