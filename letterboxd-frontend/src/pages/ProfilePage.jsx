import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProfilePage = () => {
    const { deleteProfile } = useContext(AuthContext)
    const [profileData, setProfileData] = useState(null)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const navigate = useNavigate();

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_data`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setProfileData(data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        getProfileData()
    }, [])
    
    const handleProfileDelete = async () => {
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
            console.error(error)
        }
    }
    
    return (
        <div>
            <button onClick={() => handleProfileDelete()} className='bg-red-400 text-white'>Delete Profile</button>

            {profileData && 
                <div className='flex flex-col space-y-3'>
                    {profileData.user_lists.map((list, index) => (
                        <Link to={`/list/${list._id}`} key={index}>{list.name}</Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default ProfilePage