import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import FavoriteFilms from '../components/FavoriteFilms.jsx';

const ProfilePage = () => {
    const { username } = useParams()
    const { deleteProfile } = useContext(AuthContext)
    const [profileData, setProfileData] = useState(null)
    const [authorized, setAuthorized] = useState(null)
    const [newUsername, setNewUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(1)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const sessionId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : ''

    const navigate = useNavigate();

    useEffect(() => {
        
        const getProfileData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_data/${username}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data);
                    setProfileData(data)
                    setAuthorized(data.profile.user === sessionId)
                } else {
                    throw new Error('Error finding profile data')
                }
            } catch (error) {
                navigate('/error/not_found')
            }
            setLoading(false)
        }
        getProfileData()
    }, [username, update])
    
    const handleProfileDelete = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/users/delete_profile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                deleteProfile()
                navigate('/')
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleProfileUpdate = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    new_username: newUsername
                })
            })
            if(response.ok) {
                const data = await response.json()
                navigate(`/${data.new_username}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    
    return loading ? (
        <div>loading</div>
    ) : (
        <div>
            {authorized ? (
                <div>
                    <button onClick={() => handleProfileDelete()} className='bg-red-400 text-white'>Delete Profile</button>
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className='border' placeholder='Enter new username' required/>
                    <button onClick={() => handleProfileUpdate()} className='bg-green-400 text-white'>Update Profile</button>
                </div>
            ) : (
                <div></div>
            )}

            {profileData && 
                <FavoriteFilms authorized={authorized} favorite_films={profileData.favorite_films} setUpdate={setUpdate}/>
            }

            <div className='font-bold text-xl'>{username}</div>

            <Link to={`/${username}/diary`} className='bg-blue-300'>Diary</Link>
            <Link to={`/${username}/watched`} className='bg-blue-300'>Watched</Link>
            <Link to={`/${username}/reviews`} className='bg-purple-300'>Reviews</Link>
            <Link to={`/${username}/watchlist`} className='bg-orange-300'>Watchlist</Link>
            <Link to={`/${username}/likes`} className='bg-green-300'>Likes</Link>
            <Link to={`/${username}/lists`} className='bg-pink-600'>Lists</Link>
        </div>
    )
}

export default ProfilePage