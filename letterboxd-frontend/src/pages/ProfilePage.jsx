import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProfilePage = () => {
    const { deleteProfile } = useContext(AuthContext)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    const navigate = useNavigate();
    
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
        </div>
    )
}

export default ProfilePage