import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import FavoriteFilms from '../components/FavoriteFilms.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import EditProfileForm from '../components/EditProfileForm.jsx';
import ProfileSubPageMenu from '../components/ProfileSubPageMenu.jsx';
import ReviewCard from '../components/cards/ReviewCard.jsx';
import { FaCalendar } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";

const ProfilePage = () => {
    const { username } = useParams()
    const { deleteProfile } = useContext(AuthContext)
    const [profileData, setProfileData] = useState(null)
    const [authorized, setAuthorized] = useState(null)
    
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(1)
    const [editProfile, setEditProfile] = useState(false)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const sessionId = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo'))._id : ''

    const navigate = useNavigate();

    useEffect(() => {
        
        const getProfileData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_data/${username}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data);
                    data.lists = fillListItems(data.lists)
                    setProfileData(data)
                    setAuthorized(data.profile.user === sessionId)
                } else {
                    throw new Error('Error finding profile data')
                }
            } catch (error) {
                navigate('/error/not_found')
            }
            setLoading(false)
        }
        getProfileData()
    }, [username, update])
    
    return loading ? (
        <div>loading</div>
    ) : (
        <>
            <EditProfileForm editProfile={editProfile} setEditProfile={setEditProfile} username={username}/>

            <div>
                <ProfileHeader authorized={authorized} stats={profileData.stats} username={username} setEditProfile={setEditProfile}/>
                <ProfileSubPageMenu username={username} />

                <div className='flex flex-col items-center space-y-6 md:space-y-0 lg:flex-row lg:space-x-8'>
                    <div className='flex flex-col w-full px-3 md:px-0 space-y-6'>
                        <FavoriteFilms authorized={authorized} favorite_films={profileData.favorite_films} setUpdate={setUpdate}/>

                        {/*Reviews section */}
                        <div>
                            <div className='flex items-end justify-between uppercase border-b border-b-gray-400 text-gray-300'>
                                <Link to={`/${username}/reviews`} className='hover:text-blue-500'>Recent Reviews</Link>
                                <Link to={`/${username}/reviews`} className='hover:text-blue-500 text-xs mb-1'>More</Link>
                            </div>
                            {profileData.reviews.length > 0 && 
                                profileData.reviews.map((review, index) => (
                                    <ReviewCard key={index} review={review}/>
                                ))
                            }
                        </div>
                    </div>

                    
                    <div className='flex flex-col w-full space-y-6 mt-3 px-3 md:px-0'>
                        
                        {/*Diary section */}
                        <div className='space-y-3'>
                            <div className='flex items-end justify-between uppercase border-b border-b-gray-400 text-gray-300 mb-2'>
                                <Link to={`/${username}/diary`} className='hover:text-blue-500'>Diary</Link>
                            </div>
                            {profileData.diary.length > 0 && 
                                profileData.diary.map((month, index) => (
                                    <div className='flex space-x-4 border-b border-b-gray-600 pb-2' key={index}>
                                        <div className='relative w-[40px] h-[40px]'>
                                            <FaCalendar className="text-gray-400 w-full h-full"/>
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700 mt-1">{getMonthAbbreviation(month[0].added_on)}</span>
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            {month.map((entry, index) => (
                                                <div className='flex items-end space-x-2' key={index}>
                                                    <div className='text-sm text-gray-500'>{getDayNumber(entry.added_on)}</div>
                                                    <Link to={`/film/${entry.movie.id}`} className='text-gray-300 text-sm hover:text-blue-500 font-semibold'>{entry.movie.title}</Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/*Lists section */}
                        <div>
                            <div className='flex items-end justify-between uppercase border-b border-b-gray-400 text-gray-300 mb-2'>
                                <Link to={`/${username}/lists`} className='hover:text-blue-500'>Recent Lists</Link>
                            </div>
                            
                            {profileData.lists.length > 0 &&
                                <div className='flex flex-col space-y-5'>
                                    {profileData.lists.map((list, index) => (
                                        <div key={index} className='flex flex-col space-y-2'>
                                            <div className='relative group h-[105px] w-[100px]'>
                                                {list.list_items.map((list_item, inner_index) => (
                                                    list_item ? (
                                                        list_item.movie.image ? (
                                                            <img key={inner_index}
                                                                src={`https://image.tmdb.org/t/p/w500/${list_item.movie.image}`}
                                                                alt={list_item.movie.title}
                                                                className="absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] rounded-md transition-transform duration-300"
                                                                style={{
                                                                    left: `${inner_index * 40}px`,
                                                                    zIndex: list.list_items.length - inner_index,
                                                                }}
                                                            />
                                                        ) : (
                                                            <div key={inner_index} 
                                                                className={`absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-800 border text-gray-300 flex items-center justify-center font-semibold text-center rounded-md`}
                                                                style={{
                                                                    left: `${inner_index * 40}px`,
                                                                    zIndex: list.list_items.length - inner_index,
                                                                }}
                                                                >
                                                                <MdImageNotSupported size={40}/>
                                                            </div> 
                                                        )
                                                    ) : (
                                                        <div key={inner_index} 
                                                            className={`absolute h-[105px] w-[70px] md:h-[111px] md:w-[76px] bg-gray-900 border text-gray-300 flex items-center justify-center font-semibold text-center rounded-md`}
                                                            style={{
                                                                left: `${inner_index * 40}px`,
                                                                zIndex: list.list_items.length - inner_index,
                                                            }}
                                                            >
                                                            {/* <MdImageNotSupported size={40}/> */}
                                                        </div>
                                                    )
                                                ))}
                                            </div>

                                            <div className='font-bold text-white hover:text-blue-500'>{list.name} <span className='ml-2 text-gray-400 font-normal'>{list.list_items_length !== 1 ? `${list.list_items_length} films` : '1 film'}</span></div>
                                        </div>
                                    ))}
                                </div>
                            }
                        
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default ProfilePage

function getMonthAbbreviation(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
}

function getDayNumber(dateString) {
    const date = new Date(dateString);
    return String(date.getUTCDate()).padStart(2, '0');
}

function fillListItems(lists){
    for(const list of lists){
        while(list.list_items.length < 5){
            list.list_items.push(false)
        }
    }
    return lists
}