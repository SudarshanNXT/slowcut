import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';

const ReviewsPage = () => {
    const location = useLocation();
    const [reviews, setReviews] = useState(null)
    const [loading, setLoading] = useState(true)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const isProfilePage = location.pathname.includes("profile");
    const username = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        const getReviews = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_reviews/${isProfilePage ? username : ''}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setReviews(data)
                    console.log(data);
                }
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        getReviews()
    }, [])

    return loading ? (
        <div>Loading</div>
    ) : (
        <div>
            {reviews && 
                reviews.map((review, index) => (
                    <Link to={`/review/${review._id}`} key={index} className='border'>{review.body}</Link>
                ))
            }
        </div>
    )
}

export default ReviewsPage