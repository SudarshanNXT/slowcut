import React, { useEffect, useState, useRef } from 'react'
import { useParams, Form, useNavigate } from 'react-router-dom';
import ListItemCard from '../components/cards/ListItemCard';
import SuperMegaFormCard from '../components/cards/SuperMegaFormCard';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const EditListPage = () => {
    const { id } = useParams()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const inputRef = useRef(null)

    const [update, setUpdate] = useState(5)
    const [listData, setListData] = useState(null)
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
    const username = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : ''

    useEffect(() => {
        if(localStorage.getItem('userInfo')){
            const getListData = async () => {
                try {
                    const response = await fetch(`${apiBaseUrl}/profile/get_list_data/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    if(response.ok){
                        const data = await response.json()

                        //check if creator of list is the signed in user
                        if(data.list.creator === username){
                            //prefill form data
                            setFormData({
                                name: data.list.name,
                                description: data.list.description,
                                ranked: data.list.ranked,
                                is_public: data.list.is_public
                            })
                            setListData(data)
                        } else {
                            navigate('/error/not_found')
                        }
                        
                    }
                } catch (error) {
                    console.error(error)
                }
                setLoading(false)
            }
            getListData()
        }
    }, [id, update])

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
                navigate(`/list/${id}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
            setErrorMessage(error.message)
        }

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
                navigate(`/${username}`)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSearch = async () => {
        if (inputRef.current) {
            inputRef.current.blur(); // Hide keyboard
        }
        
        try {
            if(query.length > 0){
                const response = await fetch(`${apiBaseUrl}/tmdb/search?query=${query}&page=1&type=films`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setResults(data.results)
                } else {
                    const error = await response.json()
                    throw new Error(error.message)
                }
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            handleSearch();
        }
    };

    const handleMovieClick = async (movie) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movies_to_lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: movie.id,
                    list_of_lists: [id],
                    title: movie.title,
                    id: movie.id,
                    image: movie.image,
                    genres: movie.genres,
                    release_date: movie.release_date
                })
            })
            if(response.ok){
                const data = await response.json()
                setQuery('')
                setResults(null)
                setUpdate(prev => prev + 1)
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div className='flex flex-col mx-3 md:mx-0'>
            <div className='text-left text-2xl font-semibold text-gray-400 border-b border-gray-400 pb-1 mt-3'>Edit List</div>

            {errorMessage && <div className='border-2 border-red-800 bg-red-300 p-1 px-2 w-fit text-red-600 mt-3'>{errorMessage}</div>}
            <Form onSubmit={ handleSubmit }>
                <div className='md:grid md:grid-cols-2 md:gap-4 mt-3'>
                    <div className='space-y-6'>
                        <div className='flex flex-col space-y-2 mb-2'>
                            <label htmlFor="username" className='text-white'>List name:</label>
                            <input
                                type="text"
                                id="name"
                                name='name'
                                value={formData.name}
                                onChange={handleChange} 
                                required
                                className=' bg-primary rounded-md p-2 w-full text-gray-300 focus:outline-none focus:bg-white focus:text-black'
                            />
                            <div className='text-xs text-white'>50 character limit</div>
                        </div>

                        <div className="flex flex-col space-y-2 mb-2">
                            <label htmlFor="is_public" className='text-white'>Who can view:</label>
                            <select name="is_public" value={formData.is_public} onChange={handleChange} className='bg-primary p-2 text-gray-300 rounded-md'>
                                <option value={true}>Public</option>
                                <option value={false}>Private</option>
                            </select>
                        </div>

                        <div className='flex items-center'>
                            <input
                                type="checkbox"
                                name="ranked"
                                checked={formData.ranked} 
                                onChange={handleChange} 
                            />
                            <div className='ml-2 text-white'>Ranked</div>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-2 mb-4 mt-4 md:mt-0'>
                        <label htmlFor="description" className='text-white'>Description:</label>
                        <textarea
                            id="description"
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            className=' bg-primary rounded-md p-2 w-full h-32 resize-vertical text-gray-300 focus:outline-none focus:bg-white focus:text-black'
                        ></textarea>
                        <div className='text-xs text-white'>(Optional)</div>
                    </div>
                </div>

                <div className='flex items-center flex-col-reverse md:flex-row md:justify-between my-3 relative gap-y-6 md:gap-y-0'>
                    <div className='inline-flex'>
                        <button onClick={() => inputRef.current?.focus()} type='button' className='uppercase text-nowrap w-fit px-2 rounded-md font-semibold bg-hover hover:bg-green-500 text-white text-sm mr-2'>Add a film</button>
                        <div className='relative w-fit'>
                            <button type='button' onClick={() => handleSearch()}>
                                <FaSearch size={20} className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
                            </button>
                            <input 
                                type="text" 
                                ref={inputRef}
                                placeholder='Enter name of film...' 
                                className='bg-primary rounded-md p-2 text-gray-300 focus:outline-none focus:bg-white focus:text-black'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {results && results.length > 0 &&
                            <button type='button' onClick={() => {setResults(null), setQuery('')}} className='rounded-full bg-red-500 hover:bg-red-400 text-white font-bold h-[35px] w-[35px] ml-2 flex items-center justify-center'><IoMdClose size={27}/></button>
                        }
                    </div>

                    <div className='inline-flex items-center gap-3'>
                        <button type='button' onClick={() => navigate(-1)} className='w-fit text-lg py-1 px-2 rounded-md font-semibold bg-light hover:bg-gray-500 text-white'>Cancel</button>
                        <button type='button' className='w-fit text-lg py-1 px-2 rounded-md font-semibold bg-red-600 hover:bg-red-500 text-white' onClick={handleDelete}>Delete</button>
                        <button type="submit" className='w-fit text-lg py-1 px-2 rounded-md font-semibold bg-hover hover:bg-green-500 text-white'>Save</button>
                    </div>

                    {/*Search results display */}
                    {results && results.length > 0 &&
                        <div className='absolute top-full left-0 mt-1 p-2 right-0 flex flex-col space-y-1 h-[350px] overflow-y-auto rounded-md bg-gray-800'>
                            {results.map((movie, index) => (
                                <SuperMegaFormCard
                                    key={index} 
                                    movie={movie} 
                                    handleMovieClick={handleMovieClick}
                                />
                            ))}
                        </div>
                    }
                </div>                
            </Form>

            

            {/*List items display */}
            {listData && listData.movies && listData.movies.length > 0 && 
                <div>
                    {listData.movies.map((movie, index) => (
                        <ListItemCard key={index} movie={movie} ranked={formData.ranked} list_id={id} setUpdate={setUpdate}/>
                    ))}
                </div>
            }
            {listData && listData.movies && listData.movies.length === 0 &&
                <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>Your list is empty.</div>
            }
        </div>
    )
}

export default EditListPage