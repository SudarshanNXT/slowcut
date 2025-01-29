import { Form, Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ isMobile, searchDropdown, setSearchDropdown, setSigninDropdown }) => {
    const [searchInput, setSearchInput] = useState('')

    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        e.preventDefault()
        if(searchInput.length === 0){
            return
        }
        navigate(`/search/${searchInput}`)
    }

    return isMobile ? (
        <>
            <button onClick={() => {setSearchDropdown(prev => !prev), setSigninDropdown(false)}} className='text-gray-400 transition-colors duration-200 '>
                <FaSearch size={24}/>
            </button>

            {searchDropdown && 
                <Form onSubmit={handleSearch} className='absolute left-0 top-full w-full bg-primary p-4'>
                    <div className='relative w-full'>
                        <FaSearch size={20} className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input 
                            type='text'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className='w-full bg-white focus:outline-none pr-8 py-2 pl-2 text-black font-normal rounded-md'
                        />
                    </div>
                </Form>
            }
        </>
    ) : (
        <Form onSubmit={handleSearch} >
            <div className='bg-light py-1 px-2 rounded-xl flex items-center transition-all duration-200 focus-within:bg-white focus-within:text-black w-[150px] focus-within:w-[170px]'>
                <input 
                    type='text'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className='bg-transparent focus:outline-none px-2 text-white focus:text-black font-normal w-full'
                />
                <button className='text-gray-400 transition-colors duration-200 focus-within:text-black'>
                    <FaSearch />
                </button>
            </div>
        </Form>
    )
}

export default SearchBar