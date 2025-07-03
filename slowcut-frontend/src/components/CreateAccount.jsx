import React, { useState, useContext } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext.jsx'
import { IoClose } from "react-icons/io5"

const CreateAccount = ({ createAccount, setCreateAccount }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const { registerUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.toLowerCase(),
                    email,
                    password,
                    confirm_password: confirmPassword 
                })
            })
            
            if (response.ok) {
                const data = await response.json()
                registerUser(data)
                navigate('/')
                setCreateAccount(false)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
        setLoading(false)
    }

    const validateUsername = () => {
        if (username.length > 150) return false
        return /^[a-zA-Z0-9@.+/_-]+$/.test(username)
    }

    const validateEmail = () => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${createAccount ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col mx-4 w-full md:w-[500px] bg-light p-5 rounded-md relative ${createAccount ? '' : 'scale-50'} transition-all duration-200`}>

                <button onClick={() => setCreateAccount(false)} className='absolute top-1 right-1 text-xl text-gray-300'>
                    <IoClose size={30}/>
                </button>

                <div className='space-y-4'>
                    <div className='text-left text-2xl font-semibold text-gray-300'>Create Account</div>
                    {errorMessage && <div className='border-2 border-red-800 bg-red-400 p-1 px-2 w-fit text-red-700'>{errorMessage}</div>}
                    
                    <Form onSubmit={ submitHandler } className='space-y-4'>

                        {/* Username */}
                        <div className='flex flex-col space-y-1 mb-2'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="username" className='text-white'>Username:</label>
                                {username.length > 0 && !validateUsername() && <span className='text-red-500'>Invalid</span>}
                                {username.length > 0 && validateUsername() && <span className='text-green-500'>Valid</span>}
                            </div>
                            <input
                                type="text"
                                id="create_account_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            />
                            <div className='text-xs'>Max 150 chars, only letters, digits and @/./+/-/_ allowed.</div>
                        </div>

                        {/* Email */}
                        <div className='flex flex-col space-y-1 mb-2'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="email" className='text-white'>Email:</label>
                                {email.length > 0 && !validateEmail() && <span className='text-red-500'>Invalid</span>}
                                {email.length > 0 && validateEmail() && <span className='text-green-500'>Valid</span>}
                            </div>
                            <input
                                type="email"
                                id="create_account_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            />
                            <div className='text-xs'>Enter a valid email address.</div>
                        </div>

                        {/* Password */}
                        <div className='flex flex-col space-y-1 mb-2'>
                            <div className='flex justify-between items-center'>
                                <label htmlFor="password" className='text-white'>Password:</label>
                                {password.length > 0 && password.length < 4 && <span className='text-red-500'>Invalid</span>}
                                {password.length > 0 && password.length >= 4 && <span className='text-green-500'>Valid</span>}
                            </div>
                            <input
                                type='password'
                                id="create_account_password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            />
                            <div className='text-xs'>Minimum 4 characters.</div>
                        </div>
                        
                        {/* Confirm Password */}
                        <div className='flex flex-col space-y-1 mb-4'>
                            <label htmlFor="confirmPassword" className='text-white'>Confirm Password:</label>
                            <input
                                type='password'
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className='rounded-md p-2 w-full bg-gray-300 focus:outline-none focus:bg-white'
                            />
                        </div>
                    
                        <button type="submit" disabled={loading} className='w-fit py-1 px-2 rounded mb-4 self-start bg-hover hover:bg-green-500 text-white font-bold'>
                            {loading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount
