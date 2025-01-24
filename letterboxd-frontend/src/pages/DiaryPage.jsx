import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';

const DiaryPage = () => {
    const [diary, setDiary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(0)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    useEffect(() => {
        const getDiaryData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_diary_data`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setDiary(data)
                    console.log(data);
                }
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        getDiaryData()
    }, [update])

    const updateDiaryEntry = async (entry_id) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_diary_entry/${entry_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteDiaryEntry = async (entry_id) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_diary_entry/${entry_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setUpdate(prev => prev + 1)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    if(diary && !loading){
        return <div>
                    {diary.map((entry, index) => (
                        <div key={index} className='border'>
                            <div>{entry.movie.title}</div>
                            <div>{entry.like_status ? 'liked' : 'not liked'}</div>
                            <div>{entry.rewatch ? 'rewatched' : 'not rewatched'}</div>
                            <button onClick={() => updateDiaryEntry(entry._id)} className='bg-green-400'>Edit</button>
                            <button onClick={() => deleteDiaryEntry(entry._id)} className='bg-red-400'>Delete</button>
                        </div>
                    ))}
                </div>
    } else if(loading){
        return <div>Loading</div>
    } else {
        return <div>Error</div>
    }
}

export default DiaryPage