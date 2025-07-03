import React from 'react'
import { IoIosStar } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { LuText } from "react-icons/lu";
import { PiSquaresFourBold } from "react-icons/pi";

const Features = () => {
    return (
        <div className='text-gray-200'>
            <div className='uppercase text-gray-400 mb-2'>SlowCut lets you...</div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3'>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <IoEyeSharp size={40} className='flex-shrink-0'/>
                    <p>Keep track of every film you've
                        ever watched (or just start 
                        from the day you join)
                    </p>
                </div>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <FaHeart size={40} className='flex-shrink-0'/>
                    <p>Show some love for your
                        favorite films, lists and reviews
                        with a like
                    </p>
                </div>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <LuText size={40} className='flex-shrink-0'/>
                    <p>Write and share reviews, and
                        follow friends and other
                        members and read theirs
                    </p>
                </div>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <IoIosStar size={40} className='flex-shrink-0'/>
                    <p>Rate each film on a five-star
                        scale to record
                        and share your reaction
                    </p>
                </div>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <FaCalendar size={40} className='flex-shrink-0'/>
                    <p>Keep a diary of your film
                        watching
                    </p>
                </div>
                <div className='bg-light rounded-md flex space-x-3 p-3'>
                    <PiSquaresFourBold size={40} className='flex-shrink-0'/>
                    <p>Compile and share lists of
                        films on any topic and keep a
                        watchlist of films to see
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Features