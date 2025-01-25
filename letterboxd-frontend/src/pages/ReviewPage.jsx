import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';

const ReviewPage = () => {
    const { id } = useParams()
    const [review, setReview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isCreator, setIsCreator] = useState(false)
    const [reviewBody, setReviewBody] = useState('')
    const [update, setUpdate] = useState(0)

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const username = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        const getReview = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_review/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setReview(data)
                    setIsCreator(data.creator === username)
                    console.log(data);
                }
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        getReview()
    }, [update])

    const handleEditReview = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_review/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    body: reviewBody
                })
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
                console.log(data);

            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteReview = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_review/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                console.log(data);
                navigate(-1)

            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    return loading ? (
        <div>Loading</div>
    ) : (
        <div>
            <div>{review.body}</div>
            {isCreator ? (
                <div>
                    <textarea 
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        placeholder="Enter new review..."
                        className=''
                    >
                    </textarea>
                    <button onClick={() => handleEditReview()} className='bg-green-400'>Edit</button>
                    <button onClick={() => handleDeleteReview()} className='bg-red-400'>Delete</button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default ReviewPage