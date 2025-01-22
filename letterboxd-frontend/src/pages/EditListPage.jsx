import React, { useEffect, useState } from 'react'
import { Link, useParams, Form, useNavigate } from 'react-router-dom';
import ListMovieCard from '../components/cards/ListMovieCard';

const EditListPage = () => {
    const { id } = useParams()
    const [listData, setListData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ranked: false,
        is_public: true
    })

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
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

                        //check if creator of list is the signed in user
                        const username = JSON.parse(localStorage.getItem('userInfo')).username
                        if(data.list.creator === username){
                            console.log(data);
                            setListData(data)

                            //prefill form data
                            setFormData({
                                name: data.list.name,
                                description: data.list.description,
                                ranked: data.list.ranked,
                                is_public: data.list.is_public
                            })
                        } else {
                            navigate('/error')
                        }
                        
                    }
                } catch (error) {
                    console.error(error)
                }
                setLoading(false)
            }
            getListData()
        }
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_list_data/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if(response.ok){
                const data = await response.json()
                navigate(`/list/${id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }

    }

    const handleDelete = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${apiBaseUrl}/profile/delete_list/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.ok){
                const data = await response.json()
                navigate(`/profile`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div>
            <div className='text-center text-4xl font-bold '>Create List</div>

            <button className='bg-red-400' onClick={handleDelete}>Delete List</button>

            {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600'>{errorMessage}</div>}
            <Form onSubmit={ handleSubmit }>
                <div className='flex flex-col space-y-2 mb-2'>
                    <label htmlFor="username">List name:</label>
                    <input
                        type="text"
                        id="name"
                        name='name'
                        value={formData.name}
                        onChange={handleChange} 
                        required
                        placeholder='Enter list name'
                        className='border border-gray-400 bg-primary rounded-md p-2 w-full'
                    />
                    <div className='text-xs'>50 character limit</div>
                </div>
                

                <div className='flex flex-col space-y-2 mb-4'>
                    <label htmlFor="password">Description:</label>
                    <textarea
                        id="description"
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        className='border border-gray-400 bg-primary rounded-md p-2 w-full h-32 resize-vertical'
                        placeholder="Enter list description"
                    ></textarea>
                    <div className='text-xs'>(Optional)</div>
                </div>

                <select name="is_public" value={formData.is_public} onChange={handleChange}>
                    <option value={true}>Public</option>
                    <option value={false}>Private</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        name="ranked"
                        checked={formData.ranked} 
                        onChange={handleChange} 
                    />
                    Ranked
                </label>

                <button type="submit" className='w-fit text-lg py-2 px-3 rounded-lg mb-4 font-semibold'>Create</button>
                
            </Form>
        </div>
    )
}

export default EditListPage