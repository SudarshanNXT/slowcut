import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { sortResults } from '../utils/sorting';
import MovieCard from '../components/cards/MovieCard';
import ListMovieCard from '../components/cards/ListMovieCard';
import { formatDate2 } from '../utils/formatDate';
import SignInForm from '../components/SignInForm';
import CreateAccount from '../components/CreateAccount';

const ListPage = () => {
    const { id } = useParams()
    const [listData, setListData] = useState(null)
    const [display, setDisplay] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sortingMetric, setSortingMetric] = useState('list_order')
    const [filters, setFilters] = useState([])
    const [filter, setFilter] = useState('none')
    const [authorized, setAuthorized] = useState(false)
    const [update, setUpdate] = useState(5)

    const [flag, setFlag] = useState(false)
    const [createAccountForm, setCreateAccountForm] = useState(false)

    const navigate = useNavigate();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    const requestUsername = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        const getListData = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/profile/get_list_data/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    console.log(data);
                    setAuthorized(requestUsername === data.list.creator)

                    //check if list is public/private and if request user is the owner
                    if(!data.list.is_public && data.list.creator !== requestUsername){
                        navigate('/error/not_found')
                    }
                    setListData(data)
                    setDisplay(data.movies)
                    setFilters(getFilters(data.movies)) 
                }
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getListData()
    }, [id, update])

    const getFilters = (arr) => {
        const genreNames = arr.flatMap(movie => movie.genres.map(genre => genre.name));
        const uniqueGenres = [...new Set(genreNames)];
        return uniqueGenres;
    };

    const handleSortingChange = (e) => {
        setSortingMetric(e.target.value)
        setDisplay(sortResults(e.target.value, display))
    } 

    const handleFilterChange = (e) => {
        const selectedGenre = e.target.value
        setFilter(selectedGenre)
        if(selectedGenre === 'none') {
            setDisplay(listData.movies)
            return
        } 
        setDisplay(prev => prev.filter(movie => movie.genres.some(genre => genre.name === selectedGenre)))
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const confirm = window.confirm('Are you sure you want to delete this list?')
        if(!confirm) return

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
                navigate(`/${requestUsername}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handlePublicToggle = async () => {
        //create formData object
        const formData = {
            name: listData.list.name,
            description: listData.list.description,
            ranked: listData.list.ranked,
            is_public: !listData.list.is_public
        }

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
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return loading ? (
        <div>Loading</div>
    ) : (
        <>
            <SignInForm flag={flag} setFlag={setFlag}/>

            <CreateAccount createAccount={createAccountForm} setCreateAccount={setCreateAccountForm}/>

            <div className='flex flex-col md:grid md:grid-cols-4 mt-3 md:gap-x-8 mx-3 md:mx-0'>
                <div className={`${localStorage.getItem('userInfo') && !authorized ? 'col-span-4' : 'col-span-3'} space-y-3`}>
                    <div className='flex items-center justify-between'>
                        <div className='text-gray-300 inline-flex items-center'>
                            <FaUserCircle className='mr-2' size={23}/> 
                            List by <Link to={`/${listData.list.creator}`} className='text-white hover:text-blue-500 ml-2 font-semibold'>{listData.list.creator}</Link>
                        </div>

                        <div className='text-gray-300'>Published {formatDate2(listData.list.created_at)}</div>
                    </div>

                    {/*Filtering/Sorting Section */}
                    <div className='flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 items-center border-y border-y-gray-300 text-gray-300 py-1'>
                        {filters.length > 0 && 
                            <div className='flex items-center w-fit'>
                                <div className='mr-1'>Filter by</div>
                                <select className='bg-transparent w-fit outline-none uppercase' value={filter} onChange={handleFilterChange}>
                                    <option className={`bg-gray-400 text-black w-fit`} value={'none'}>Genre</option>
                                    {filters.map((filter, index) => (
                                        <option 
                                            className={`bg-gray-400 text-black w-fit`} 
                                            key={index} 
                                            value={filter}>
                                            {filter}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                        
                        
                        <div className='flex items-center'>
                            <div className='mr-1'>Sort by</div>
                            <select className='bg-transparent w-fit outline-none uppercase' value={sortingMetric} onChange={handleSortingChange}>
                                <option className={`bg-gray-400 text-black`}  value="list_order">List Order</option>
                                <option className={`bg-gray-400 text-black`}  value="reverse_order">Reverse Order</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_desc">Release Date (desc)</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_asc">Release Date (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_asc">Title (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_desc">Title (desc)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className='space-y-2'>
                        <div className='text-xl font-bold text-white'>{listData.list.name}</div>
                        <div className='text-gray-300'>{listData.list.description}</div>
                    </div>

                    <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2'>
                        {display.length > 0 && display.map((movie, index) => (
                            <ListMovieCard key={index} movie={movie} ranked={listData.list.ranked}/>
                        ))}
                    </div>
                    {display.length === 0 &&
                        <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No films yet.</div>
                    }
                </div>

                {authorized &&
                    <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0'>
                        <Link to={`/list/${id}/edit`} className='text-center border-b border-b-black py-2 hover:text-white'>Edit this list</Link>
                        <button onClick={(e) => handleDelete(e)} className='text-center border-b border-b-black py-2 hover:text-white'>Delete this list</button>
                        <button onClick={() => handlePublicToggle()} className='text-center py-2 hover:text-white'>Make this list {listData.list.is_public ? 'private' : 'public'}</button>
                    </div>
                }
                {!localStorage.getItem('userInfo') &&
                    <div className='flex flex-col bg-light text-gray-300 h-fit rounded-md mt-3 md:mt-0'>
                        <button onClick={() => setFlag(true)} className='py-1 border-b border-b-black w-full'>Sign in to create lists</button>
                        <button onClick={() => setCreateAccountForm(true)} className='py-1 w-full'>Create account</button>
                    </div>
                }
                
            </div>
        </>
    )
}

export default ListPage