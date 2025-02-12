import React from 'react'
import DiaryEntry from './DiaryEntry';

const Diary = ({ data, authorized, setUpdate, userData }) => {
    
    return data && data.length === 0 ? (
        <div className='w-full border flex justify-center items-center text-white h-[250px] mt-2'>No diary entries yet...</div>
    ) : (
        <>
            {/*Large screens */}
            <div className='hidden lg:grid lg:grid-cols-[68px_54px_auto_68px_92px_54px_82px_75px_92px] text-gray-300 mt-2'>
                {/*Grid Columns Header */}
                <div className='pl-1 bg-gray-900 border-b border-b-gray-400'>Month</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Day</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Film</div>
                <div className=' bg-gray-900 border-b border-b-gray-400'>Released</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Rating</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Like</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Rewatch</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Review</div>
                {authorized ? <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Edit</div> : <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>You</div>}
                
                {data.map((month, i) => (
                    <div className=' ' key={i}>
                        {month.map((entry, j) => (
                            <DiaryEntry key={j} entry={entry} i={i} j={j} month={month} authorized={authorized} setUpdate={setUpdate} userData={userData}/>
                        ))}
                    </div>
                ))}

            </div>

            {/*Medium screens */}
            <div className='hidden md:grid md:grid-cols-[68px_54px_auto_68px_54px_75px_92px] lg:hidden text-gray-300 mt-2'>
                {/*Grid Columns Header */}
                <div className='pl-1 bg-gray-900 border-b border-b-gray-400'>Month</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Day</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Film</div>
                <div className=' bg-gray-900 border-b border-b-gray-400'>Released</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Like</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Review</div>
                {authorized ? <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Edit</div> : <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>You</div>}

                {data.map((month, i) => (
                    <div className=' ' key={i}>
                        {month.map((entry, j) => (
                            <DiaryEntry key={j} entry={entry} i={i} j={j} month={month} authorized={authorized} setUpdate={setUpdate} userData={userData}/>
                        ))}
                    </div>
                ))}
            </div>

            {/*Mobile screens */}
            <div className='grid grid-cols-[68px_54px_auto_54px_75px] md:hidden text-gray-300 mt-2 mx-2'>
                {/*Grid Columns Header */}
                <div className='pl-1 bg-gray-900 border-b border-b-gray-400 '>Month</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Day</div>
                <div className='pl-3 bg-gray-900 border-b border-b-gray-400'>Film</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Like</div>
                <div className='pl-6 bg-gray-900 border-b border-b-gray-400'>Review</div>

                {data.map((month, i) => (
                    <div className=' ' key={i}>
                        {month.map((entry, j) => (
                            <DiaryEntry key={j} entry={entry} i={i} j={j} month={month} authorized={authorized} setUpdate={setUpdate} userData={userData}/>
                        ))}
                    </div>
                ))}
            </div>
        </>
        
    )
}

export default Diary