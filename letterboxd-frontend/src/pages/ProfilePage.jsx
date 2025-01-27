import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProfilePage = () => {
    const { username } = useParams()
    const { deleteProfile } = useContext(AuthContext)
    const [profileData, setProfileData] = useState(null)
    const [authorized, setAuthorized] = useState(null)
    const [newUsername, setNewUsername] = useState('')
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
        }
        getProfileData()
    }, [username])
    
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
    
    return (
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

            <div className='font-bold text-xl'>{username}</div>

            <Link to={`/${username}/diary`} className='bg-blue-300'>Diary</Link>
            <Link to={`/${username}/watched`} className='bg-blue-300'>Watched</Link>
            <Link to={'/profile/reviews'} className='bg-purple-300'>Reviews</Link>
            {profileData && 
                <div className='flex flex-col space-y-3'>
                    {/* {profileData.user_lists.map((list, index) => (
                        <Link to={`/list/${list._id}`} key={index}>{list.name}</Link>
                    ))} */}
                </div>
            }
        </div>
    )
}

export default ProfilePage