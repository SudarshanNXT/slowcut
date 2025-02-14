import React from 'react'

const AboutPage = () => {
    return (
        <div className='px-3 md:px-0 md:w-3/4 md:mx-auto text-white space-y-4'>
            <div className='text-2xl font-bold text-center mt-3'>About</div>
            
            <div>
                <div className='text-xl font-semibold'>Introduction</div>
                <p>Welcome to my Letterboxd clone app. This is a full stack application using the MERN stack.
                    All movie data is pulled from <a className='text-blue-500 hover:underline' href="https://www.themoviedb.org/">TMDB</a>.
                </p>
            </div>

            <div>
                <div className='text-xl font-semibold'>Backend Features</div>
                <ul className='list-disc pl-5'>
                    <li>Adding films to your liked/watched/watchlisted lists</li>
                    <li>Rating films on a five star scale</li>
                    <li>Logging films to your diary</li>
                    <li>Writing and reading others reviews for a particular film</li>
                    <li>Creating your own customizable lists of films</li>
                </ul>
            </div>

            <div>
                <div className='text-xl font-semibold'>Frontend</div>
                <ul className='list-disc pl-5'>
                    <li>Frontend implemented using ReactJS framework</li>
                    <li>Styling implemented using Tailwind CSS</li>
                </ul>
            </div>

            <div>
                <div className='text-xl font-semibold'>Hosting/Implementation</div>
                <ul className='list-disc pl-5'>
                    <li>Server implemented using Node.js and Express</li>
                    <li>Database implemented using MongoDB and Mongoose</li>
                    <li>Hosted on Linode Linux VM</li>
                </ul>
            </div>

            <div>For more details about the code, check out the <a className='text-blue-500 hover:underline' href="https://github.com/arriagada689/letterboxd-clone">project github page</a>.</div>
        </div>
    )
}

export default AboutPage