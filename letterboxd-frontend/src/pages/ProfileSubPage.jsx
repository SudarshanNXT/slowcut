import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';

const allowedCategories = ['diary', 'watched', 'watchlist', 'lists', 'likes', 'reviews'];

const ProfileSubPage = () => {
    const { username, category } = useParams()
    const [data, setData] = useState(null)
    const [authorized, setAuthorized] = useState(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const sessionUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''
    
    const navigate = useNavigate();

    // Validate the category
    if (!allowedCategories.includes(category)) {
        return <Navigate to="/error/not_found" />;
    }

    useEffect(() => {
        const getProfileSubData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_sub_data/${username}/${category}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data);
                    setData(data)
                    setAuthorized(sessionUsername === username)
                } else {
                    throw new Error('Error finding profile sub data')
                }
            } catch (error) {
                navigate('/error/not_found')
            }
        }
        getProfileSubData()

    }, [username, category])

    return (
        <div>ProfileSubPage</div>
    )
}

export default ProfileSubPage