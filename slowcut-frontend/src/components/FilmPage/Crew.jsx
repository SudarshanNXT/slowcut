import React from 'react'
import { Link } from 'react-router-dom';

const Crew = ({ grouped_crew }) => {
    return (
        <div className='flex flex-col space-y-2 mt-2 text-gray-300'>
            {grouped_crew.map((group, index) => (
                <div className='grid grid-cols-2 gap-2' key={index}>
                    <div className='border-b h-fit'>{group.job}</div>
                    <div className='flex flex-wrap gap-1'>
                        {group.members.map((member, index) => (
                            <Link to={`/person/${member.id}`} className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded' key={index}>{member.name}</Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Crew