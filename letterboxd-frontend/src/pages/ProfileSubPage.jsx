import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSubPageMenu from '../components/ProfileSubPageMenu';
import EditProfileForm from '../components/EditProfileForm';
import MiniMovieCard from '../components/cards/MiniMovieCard';
import ReviewCard from '../components/cards/ReviewCard';
import { MdImageNotSupported } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Diary from '../components/Diary';

const ProfileSubPage = () => {
    const { username, category } = useParams()
    const sessionUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''
    
    const [data, setData] = useState(null)
    const [userData, setUserData] = useState(null)
    const [stats, setStats] = useState(null)
    const [authorized, setAuthorized] = useState(sessionUsername === username)
    const [editProfile, setEditProfile] = useState(false)
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState(1)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    
    const navigate = useNavigate();

    const allowedCategories = ['diary', 'watched', 'watchlist', 'lists', 'likes', 'reviews'];

    // Validate the category
    if (!allowedCategories.includes(category)) {
        return <Navigate to="/error/not_found" />;
    }
    
    useEffect(() => {
        setAuthorized(sessionUsername === username)
        const getProfileSubData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_profile_sub_data/${username}/${category}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    if(category === 'lists') data.data = fillListItems(data.data)
                    setData(data.data)
                    setStats(data.stats)
                } else {
                    throw new Error('Error finding profile sub data')
                }
                
            } catch (error) {
                navigate('/error/not_found')
            } finally {
                setLoading(false)
            }
        }
        getProfileSubData()

    }, [category, username, update])

    useEffect(() => {
        if(localStorage.getItem('userInfo') && category === 'diary' && data && data.length > 0){
            const getPreDisplayData = async () => {
                try {
                    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
                    const response = await fetch(`${apiBaseUrl}/profile/get_pre_display_data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            data: data,
                            two_dimension: true
                        })
                    })
                    if(response.ok){
                        const data = await response.json()
                        setUserData(data)
                    } else {
                        const error = await response.json()
                        throw new Error(error)
                    }
                } catch (error) {
                    console.log(error.message)
                }
            }
            getPreDisplayData()
        }
    }, [data])

    return loading ? (
        <div>Loading</div>
    ) : (
        <>
            <EditProfileForm editProfile={editProfile} setEditProfile={setEditProfile} username={username}/>

            <div>
                {stats && <ProfileHeader authorized={authorized} stats={stats} username={username} setEditProfile={setEditProfile}/>}
                <ProfileSubPageMenu username={username} />

                {(category === 'watched' || category === 'watchlist' || category === 'likes') && 
                    <div className='flex flex-wrap justify-around md:justify-start gap-3 mt-3 px-3 md:px-0'>
                        {data.length > 0 && data.map((item, index) => (
                            <MiniMovieCard key={index} movie={item.movie} rating={item.rating} liked={category === 'likes'}/>
                        ))}
                        {data.length === 0 && <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No films yet...</div>}
                    </div>
                }

                {category === 'reviews' &&
                    <div className='px-3 md:px-0'>
                        {data.length > 0 && data.map((review, index) => (
                            <ReviewCard key={index} review={review}/>
                        ))}
                        {data.length === 0 && <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No reviews yet...</div>}
                    </div>
                }

                {category === 'diary' && 
                    <Diary data={data} authorized={authorized} setUpdate={setUpdate} userData={userData}/>
                }

                {category === 'lists' &&
                    <div className='px-3 md:px-0 flex flex-col space-y-5 mt-3'>
                        {data.length > 0 && data.filter(list => list.is_public || authorized).map((list, index) => (
                            <div key={index} className='relative border-b border-b-gray-400 pb-6'>
                                <div className='relative group h-[105px] w-[100px]'>
                                    {list.list_items.slice(0, 5).map((list_item, inner_index) => (
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
                                                
                                            </div>
                                        )
                                    ))}
                                </div>

                                <div className='absolute left-64 top-0 flex flex-col md:flex-row items-center font-bold text-white hover:text-blue-500 truncate'>
                                    <div className='inline-flex items-center'>
                                        <Link to={`/list/${list._id}`}>{list.name}</Link>
                                        {authorized && !list.is_public && <FaLock className='ml-2'/>}

                                    </div>
                                    <span className='ml-2 text-gray-400 font-normal'>{list.list_items_length !== 1 ? `${list.list_items_length} films` : '1 film'}</span>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No lists yet...</div>}
                    </div>
                }
            </div>
        </>
    )
}

export default ProfileSubPage

function fillListItems(lists){
    for(const list of lists){
        while(list.list_items.length < 5){
            list.list_items.push(false)
        }
    }
    return lists
}