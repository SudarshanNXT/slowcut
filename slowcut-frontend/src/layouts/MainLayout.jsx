import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    
    return (
        <>
            <Navbar />

            {isHomePage ? <Outlet /> : 
                <div className='container mx-auto pb-2 relative '>
                    <Outlet />
                </div>
            }
        </>
    )
}

export default MainLayout