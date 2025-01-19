import React from 'react'
import { useState, useContext } from 'react';
import { Form, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx';

const CreateListPage = () => {
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
            const response = await fetch(`${apiBaseUrl}/profile/create_list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if(response.ok){
                const data = await response.json()
                navigate(`/list/${data.list._id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }

    }

    return (
        <div>
            <div className='text-center text-4xl font-bold text-white'>Create List</div>
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

export default CreateListPage