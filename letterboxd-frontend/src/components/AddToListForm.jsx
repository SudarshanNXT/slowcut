import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";

import AddToListCard from './AddToListCard';

const AddToListForm = ({ addToListForm, setAddToListForm, movieData, listStatusArr, setUpdate }) => {
    const [isPublic, setIsPublic] = useState(true)
    const [displayList, setDisplayList] = useState(null)
    const [selectedLists, setSelectedLists] = useState([]);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

    //initial filtering
    useEffect(() => {
        if(listStatusArr && listStatusArr.length > 0){
            const filteredLists = listStatusArr.filter(list => list.list_item.is_public)
            setDisplayList(filteredLists)
        }
    }, [listStatusArr])

    const handleFilterClick = (command) => {
        if(command === 'public'){
            setIsPublic(true)
            const filteredArr = listStatusArr.filter(list => list.list_item.is_public)
            setDisplayList(filteredArr)
        } else {
            setIsPublic(false)
            const filteredArr = listStatusArr.filter(list => !list.list_item.is_public)
            setDisplayList(filteredArr)
        }
    }

    const addMoviesToLists = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movies_to_lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: movieData.id,
                    list_of_lists: Object.keys(selectedLists).filter((key) => selectedLists[key]),
                    title: movieData.title,
                    id: movieData.id,
                    image: movieData.image,
                    genres: movieData.genres,
                    release_date: movieData.release_date
                })
            })
            if(response.ok){
                const data = await response.json()
                setAddToListForm(false)
                setUpdate(prev => prev + 1)
                setSelectedLists([])
            } else {
                const error = await response.json()
                throw new Error(error.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleToggleList = (listId) => {
        setSelectedLists((prev) => ({
            ...prev,
            [listId]: !prev[listId] 
        }));
    };

    return (
        <div className={`fixed inset-0 h-full w-full flex items-center justify-center ${addToListForm ? 'bg-opacity-80 z-50' : 'opacity-0 pointer-events-none'} bg-black transition-all duration-200`}>
            <div className={`flex flex-col mx-4 md:mx-0 w-full md:w-[600px] bg-light rounded-md relative ${addToListForm ? '' : 'scale-50'} transition-all duration-200`}>

                <div className='flex items-center justify-between p-3 '>
                    <div className='text-white text-lg font-bold'>Add '{movieData.title}' to lists</div>
                    <button onClick={() => setAddToListForm(false)} className=' text-xl text-gray-300'>
                        <IoClose size={30}/>
                    </button>
                </div>

                {/*Public and private buttons */}
                <div className='py-4 px-6 border-b border-b-black'>
                    <div className='bg-gray-800 rounded-full grid grid-cols-2 p-1 text-gray-300'>
                        <button onClick={() => handleFilterClick('public')} className={`${isPublic ? 'bg-light ' : 'hover:text-gray-100'} rounded-full font-semibold`}>Public</button>
                        <button onClick={() => handleFilterClick('private')} className={`${!isPublic ? 'bg-light' : 'hover:text-gray-100'} rounded-full font-semibold`}>Private</button>
                    </div>
                </div>

                <div className='px-6 border-b border-b-black'>
                    <Link to={'/list/new'} className='flex items-center w-fit py-2 text-white'><FaPlus className='mr-2'/> <span>New List...</span></Link>
                </div>

                <div className=''>
                    {displayList && displayList.map((list, index) => (
                        <AddToListCard key={index} list={list.list_item} status={list.status} flag={selectedLists[list.list_item._id] || false} toggleFlag={handleToggleList}/>
                    ))}       
                </div>   
                
                <div className='flex justify-between items-center px-6 text-gray-300 bg-gray-800 rounded-b-md p-3'>
                    {Object.values(selectedLists).filter(Boolean).length > 0 ? (
                        Object.values(selectedLists).filter(Boolean).length === 1 ? (
                            <div>1 list selected</div>
                        ) : (
                            <div>{Object.values(selectedLists).filter(Boolean).length} lists selected</div>
                        )
                    ) : (
                        <div></div>
                    )}
                    <button 
                        onClick={() => addMoviesToLists()} 
                        className='bg-hover hover:bg-green-500 px-2 py-1 font-semibold text-white rounded-md'
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddToListForm