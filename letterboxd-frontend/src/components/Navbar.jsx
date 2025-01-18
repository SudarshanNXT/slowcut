import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'

const Navbar = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [isLoggedIn, setIsLoggedIn] = useState(userInfo ? true : false)
    const [searchInput, setSearchInput] = useState('')
    const { logoutUser, navbarUpdate } = useContext(AuthContext)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(userInfo ? true : false)
    }, [localStorage.getItem('userInfo')])

    const logoutHandler = (e) => {
        e.preventDefault()
        logoutUser()
        navigate('/')
    }

    const goBack = () => {
        navigate(-1)
    }

    const goForwards = () => {
        navigate(1)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/search/${searchInput}`)
    }
    
    return (
        <div className='flex justify-between px-5'>
            <div className='space-x-5'>
                <Link to={'/'}>Home</Link>
                <Link to={'/signup'}>Sign Up</Link>
                <Link to={'/login'}>Log In</Link>
                <Link to={'/films'}>Films</Link>
                <form onSubmit={handleSearch}>
                    <input 
                        type='text'
                        placeholder='search...'
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className='border-2'
                    />
                </form>
            </div>

            {isLoggedIn ? (
                <div className='space-x-2'>
                    <Link onClick={(e) => logoutHandler(e)}>Log Out</Link>
                    <Link to={'/profile'}>Profile</Link>
                </div>
            ) : (
                <div>Not logged in</div>
            )}
        </div>
    )
}

export default Navbar