import React, { useState, useContext } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { Link, useParams, useNavigate, Form } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const EditProfileForm = ({ editProfile, setEditProfile, username }) => {
    const [newUsername, setNewUsername] = useState(username)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const { deleteProfile } = useContext(AuthContext)

    const navigate = useNavigate();
    
    //className={`fixed inset-0 h-full w-full flex items-center justify-center ${editProfile ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}
    //className={`flex flex-col mx-4 md:mx-0 w-full md:w-[800px] bg-light rounded-md relative ${editProfile ? '' : 'scale-50'} transition-all duration-200`}

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${apiBaseUrl}/profile/update_profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    new_username: newUsername
                })
            })
            if(response.ok) {
                const data = await response.json()
                setEditProfile(false)
                navigate(`/${data.new_username}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleProfileDelete = async (e) => {
        e.preventDefault()

        // Show a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${apiBaseUrl}/users/delete_profile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok) {
                deleteProfile()
                setEditProfile(false)
                navigate('/')
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${editProfile ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col mx-4 md:mx-0 w-full md:w-[500px] bg-light rounded-md relative ${editProfile ? '' : 'scale-50'} transition-all duration-200`}>
                <div className='flex items-center justify-between border-b border-b-black p-3'>
                    <div className='text-white text-lg font-bold'>Edit/Delete Profile...</div>
                    <button onClick={() => setEditProfile(false)} className='text-xl text-gray-300'>
                        <IoMdClose size={30}/>
                    </button>
                </div>

                <Form onSubmit={handleProfileUpdate}>
                    <div className='flex flex-col space-y-1 p-3'>
                        <label htmlFor="new_username" className='text-xs text-white'>New Username:</label>
                        <input 
                            type="text" 
                            value={newUsername} 
                            onChange={(e) => setNewUsername(e.target.value)} 
                            className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            placeholder='Enter new username' 
                            required
                        />
                    </div>

                    <div className='flex items-center justify-between p-3'>
                        <button type="button" onClick={(e) => handleProfileDelete(e)} className='flex items-center w-fit bg-red-600 hover:bg-red-500 font-bold px-3 rounded-md text-lg text-white'><FaTrashAlt className='mr-2'/>Delete Profile</button>
                        <button type='submit' className='w-fit bg-hover hover:bg-green-500 font-bold px-3 rounded-md text-lg text-white'>Save</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default EditProfileForm