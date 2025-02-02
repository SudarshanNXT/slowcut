import React from 'react'
import { Form, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'
import { IoClose } from "react-icons/io5";

const SignInForm = ({ flag, setFlag }) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { loginUser } = useContext(AuthContext)

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/users/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            if (response.ok){
                const data = await response.json()
                
                loginUser(data);
                window.location.href = window.location.href
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
    
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message)
        }
    }

    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${flag ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col mx-4 w-full md:w-[300px] bg-light p-5 rounded-md relative ${flag ? '' : 'scale-50'} transition-all duration-200`}>

                {/*Close button */}
                <button onClick={() => setFlag(false)} className='absolute top-1 right-1 text-xl text-gray-300'>
                    <IoClose size={30}/>
                </button>

                <div className='space-y-4'>
                    <div className='text-left text-2xl font-semibold text-gray-300'>Sign In</div>
                    {errorMessage && <div className='border-2 border-red-800 bg-red-400 p-1 px-2 w-fit text-red-700'>{errorMessage}</div>}
                    
                    <Form onSubmit={ submitHandler } className='space-y-4'>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="username" className='text-white'>Username:</label>
                            <input
                                type="text"
                                id="sign_in_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            />
                        </div>
                        <div className='flex flex-col space-y-1 mb-2'>
                            <label htmlFor="password" className='text-white'>Password:</label>
                            <div className='relative'>
                                <input
                                    type='password'
                                    id="sign_in_password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                                />
                            </div>
                        </div>
                    
                        <button type="submit" className='w-fit py-1 px-2 rounded mb-4 self-start bg-hover hover:bg-green-500 text-gray-300 font-bold'>Sign In</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default SignInForm