import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSubPageMenu from '../components/ProfileSubPageMenu';
import EditProfileForm from '../components/EditProfileForm';

const allowedCategories = ['diary', 'watched', 'watchlist', 'lists', 'likes', 'reviews'];

const ProfileSubPage = () => {
    const { username, category } = useParams()
    const [data, setData] = useState(null)
    const [stats, setStats] = useState(null)
    const [authorized, setAuthorized] = useState(null)
    const [editProfile, setEditProfile] = useState(false)
    const [loading, setLoading] = useState(true)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const sessionUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''
    
    const navigate = useNavigate();

    // Validate the category
    if (!allowedCategories.includes(category)) {
        return <Navigate to="/error/not_found" />;
    }

    useEffect(() => {
        setAuthorized(sessionUsername === username)
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
                    setData(data.data)
                    setStats(data.stats)
                } else {
                    throw new Error('Error finding profile sub data')
                }
                setLoading(false)
            } catch (error) {
                navigate('/error/not_found')
            }
        }
        getProfileSubData()

    }, [username, category])

    return loading ? (
        <div>Loading</div>
    ) : (
        <>
            <EditProfileForm editProfile={editProfile} setEditProfile={setEditProfile} username={username}/>

            <div>
                {stats && <ProfileHeader authorized={authorized} stats={stats} username={username} setEditProfile={setEditProfile}/>}
                <ProfileSubPageMenu username={username} />
            </div>
        </>
    )
}

export default ProfileSubPage