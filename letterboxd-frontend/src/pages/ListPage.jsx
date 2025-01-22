import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ListMovieCard from '../components/cards/ListMovieCard';

const ListPage = () => {
    const { id } = useParams()
    const [listData, setListData] = useState(null)
    const [loading, setLoading] = useState(true)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    useEffect(() => {
        const getListData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_list_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    // console.log(data);
                    setListData(data)
                    
                }
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
        }
        getListData()
    }, [])

    if(listData && !loading){
        return (
            <div>
                <div>List by {listData.list.creator}</div>
                <div className='text-lg font-bold'>{listData.list.name}</div>
                <div className=''>{listData.list.description}</div>
                <Link to={`/list/${id}/edit`} className='bg-green-400'>Edit List</Link>

                <div className='flex flex-wrap gap-2'>
                    {listData.movies.map((movie, index) => (
                        <ListMovieCard key={index} movie={movie} list_id={id}/>
                    ))}
                </div>
            </div>
        )
    } else if(loading){
        <div>Loading</div>
    } else {
        <div>Error</div>
    }
}

export default ListPage