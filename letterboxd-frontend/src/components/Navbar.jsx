import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaList } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";

import SearchBar from './SearchBar.jsx';
import SignIn from './SignIn.jsx';
import { IoClose } from 'react-icons/io5';
import CreateAccount from './CreateAccount.jsx';
import SuperMegaForm from './SuperMegaForm.jsx';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/'
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [isLoggedIn, setIsLoggedIn] = useState(userInfo ? true : false)
    const [popup, setPopup] = useState(false)
    const { logoutUser } = useContext(AuthContext)
    const sessionUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    const [signinDropdown, setSigninDropdown] = useState(false)
    const [searchDropdown, setSearchDropdown] = useState(false)
    const [menuDropdown, setMenuDropdown] = useState(false)
    const [createAccount, setCreateAccount] = useState(false)
    const [createList, setCreateList] = useState(false)
    const [superMegaForm, setSuperMegaForm] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(userInfo ? true : false)
    }, [localStorage.getItem('userInfo')])

    const logoutHandler = (e) => {
        e.preventDefault()
        logoutUser()
        navigate('/')
        setMenuDropdown(false)
        setPopup(false)
    }
    
    return (
        <>
            {/*Create account pop up form */}
            <CreateAccount createAccount={createAccount} setCreateAccount={setCreateAccount}/>

            <SuperMegaForm superMegaForm={superMegaForm} setSuperMegaForm={setSuperMegaForm}/>

            {/*Desktop Navbar */}
            <nav className={`hidden md:block ${isHomePage ? 'absolute bg-transparent px-1 text-gray-200' : 'bg-primary text-gray-300'} bg-primary font-bold h-[65px] uppercase z-50 w-full`}>
                <div className='flex justify-between items-center container mx-auto h-full'>
                    {/*Logo */}
                    <Link to={'/'} className='flex items-center'>
                        <img src="https://a.ltrbxd.com/logos/letterboxd-logo-h-neg-rgb.svg" alt="Logo" className="h-16" />
                    </Link>
                    
                    {/*Right Side */}
                    <div className='flex items-center gap-x-3 text-sm h-full relative'>
                        {isLoggedIn ? (
                            <>
                                <div className='relative flex items-center group font-bold rounded-t-md hover:bg-light w-fit p-2'>
                                    <FaUserCircle className='mr-2' size={22}/>
                                    {sessionUsername.slice(0, 10)}
                                    <IoIosArrowDown  className='ml-1'/>
                                    <div className='absolute left-0 top-full hidden group-hover:flex flex-col bg-inherit text-black rounded-b-md w-full font-normal text-xs z-50'>
                                        <Link className='pl-2 py-2 hover:bg-gray-700 hover:text-white' to={'/'}>Home</Link>
                                        <Link to={`/${sessionUsername}`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Profile</Link>
                                        <a href={`/${sessionUsername}/watched`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Watched</a>
                                        <a href={`/${sessionUsername}/diary`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Diary</a>
                                        <a href={`/${sessionUsername}/reviews`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Reviews</a>
                                        <a href={`/${sessionUsername}/watchlist`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Watchlist</a>
                                        <a href={`/${sessionUsername}/lists`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Lists</a>
                                        <a href={`/${sessionUsername}/likes`} className='pl-2 py-2 hover:bg-gray-700 hover:text-white'>Likes</a>
                                        <button onClick={(e) => logoutHandler(e)} className='pl-2 py-2 hover:bg-gray-700 hover:text-white text-left uppercase border-t border-t-gray-700'>Sign Out</button>
                                    </div>
                                </div>

                                <Link className='flex items-center hover:text-white' to={'/films'}>Films</Link>
                                <Link className='flex items-center hover:text-white' to={'/about'}>About</Link>
                                <SearchBar />
                                
                                <div className='inline-flex items-center font-bold h-[28px] bg-hover rounded-md relative'>
                                    <button onClick={() => setSuperMegaForm(true)} className=' hover:bg-green-500 flex items-center uppercase p-1 rounded-l-md'><FaPlus className='mr-1' size={12}/><div className='mr-1 text-white'>Log</div></button>
                                    <div className='h-full w-[1px] bg-white'></div>
                                    <button onClick={() => setCreateList(prev => !prev)} className='hover:bg-green-500 flex items-center p-1 h-full rounded-r-md'><IoIosArrowDown className=' font-bold text-white' size={14}/></button>

                                    {/*Create list dropdown */}
                                    {createList && <Link to={'/list/new'} onClick={() => setCreateList(false)} className='absolute top-full right-0 mt-1 bg-gray-500 text-gray-100 text-nowrap hover:bg-gray-400 flex items-center p-1 rounded-md px-3 font-normal text-sm normal-case'>Start a new list...</Link>}
                                </div>
                            </>
                        ) : (
                            <>
                                <SignIn popup={popup} setPopup={setPopup}/>
                                <button onClick={() => setPopup(true)} className='uppercase hover:text-white'>Sign In</button>
                                <button onClick={() => setCreateAccount(true)} className='uppercase hover:text-white'>Create Account</button>
                                <Link className='flex items-center hover:text-white' to={'/films'}>Films</Link>
                                <Link className='flex items-center hover:text-white' to={'/about'}>About</Link>
                                <SearchBar />
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/*Mobile navbar */}
            <nav className={`flex md:hidden text-gray-300 bg-primary h-[65px] uppercase z-50 w-full relative`}>
                <div className='flex justify-between items-center h-full p-2 w-full relative z-20'>
                    {/*Logo */}
                    <Link to={'/'} className='flex items-center'>
                        <img src="https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb.svg" alt="Logo" className="h-[55px]" />
                    </Link>

                    {/*Right Side */}
                    <div className='flex items-center gap-x-3'>
                        {isLoggedIn ? (
                            <button onClick={() => setSuperMegaForm(true)}><FaPlus size={28}/></button>
                        ) : (
                            <SignIn isMobile={true} setPopup={setPopup} signinDropdown={signinDropdown} setSigninDropdown={setSigninDropdown} setSearchDropdown={setSearchDropdown}/>
                        )}
                        <button onClick={() => setMenuDropdown(prev => !prev)}>
                            {menuDropdown ? <IoClose size={30}/> : <FaList size={28}/>}
                        </button>

                        <SearchBar isMobile={true} searchDropdown={searchDropdown} setSearchDropdown={setSearchDropdown} setSigninDropdown={setSigninDropdown}/>
                    </div>
                    
                </div>

                {/*Menu dropdown */}
                <div className={`absolute top-full w-full flex flex-col bg-primary transform transition-transform duration-300 font-bold z-10 
                                ${menuDropdown ? 'translate-y-0' : '-translate-y-[150%] pointer-events-none'}`}>
                    {isLoggedIn ? (
                        <>
                            <div className='flex items-center pl-4 py-2 hover:bg-gray-700'><FaUserCircle className='mr-3'/>{sessionUsername.slice(0, 10)}</div>
                            <div className='grid grid-cols-2 gap-4 pl-8 pr-2 font-normal text-gray-400 mb-1'>
                                <div className='col-span-2 border-t-gray-700 border-t'></div>
                                <Link className='hover:bg-gray-700 hover:text-white' to={'/'}>Home</Link>
                                <Link className='hover:bg-gray-700 hover:text-white' to={`/${sessionUsername}`} onClick={() => setMenuDropdown(false)}>Profile</Link>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/watched`} onClick={() => setMenuDropdown(false)}>Watched</a>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/diary`} onClick={() => setMenuDropdown(false)}>Diary</a>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/reviews`} onClick={() => setMenuDropdown(false)}>Reviews</a>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/watchlist`} onClick={() => setMenuDropdown(false)}>Watchlist</a>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/lists`} onClick={() => setMenuDropdown(false)}>Lists</a>
                                <a className='hover:bg-gray-700 hover:text-white' href={`/${sessionUsername}/likes`} onClick={() => setMenuDropdown(false)}>Likes</a>
                                <button onClick={(e) => logoutHandler(e)} className='col-span-2 hover:bg-gray-700 hover:text-white text-left uppercase border-y border-y-gray-700 py-2'>Sign Out</button>
                            </div>
                        </>
                    ) : (
                        <Link onClick={() => {setMenuDropdown(false), setCreateAccount(true)}} className='flex items-center pl-4 py-2 hover:bg-gray-700'><FaKey className='mr-3'/><span>CREATE ACCOUNT</span></Link>
                    )}
                    
                    <Link to={'/list/new'} onClick={() => setMenuDropdown(false)} className='flex items-center pl-4 py-2 hover:bg-gray-700'><PiSquaresFourBold className='mr-3'/> <span>CREATE LIST</span></Link>
                    <Link to={'/films'} onClick={() => setMenuDropdown(false)} className='flex items-center pl-4 py-2 hover:bg-gray-700'><MdMovie className='mr-3'/> <span>FILMS</span></Link>
                    <Link to={'/about'} onClick={() => setMenuDropdown(false)} className='flex items-center pl-4 py-2 hover:bg-gray-700'><FaInfoCircle className='mr-3'/> <span>ABOUT</span></Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar