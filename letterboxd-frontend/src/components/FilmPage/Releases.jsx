import React from 'react'
import countries from '../../data/countries.js';

const Releases = ({ releases }) => {
    return (
        <div className='flex flex-col space-y-2 mt-2 text-gray-300'>
            {releases.map((release_type, index) => (
                <div key={index}>
                    <div className='border-b-2 h-fit'>{release_type.type}</div>
                    <div>
                        {release_type.releases.map((release, index) => (
                            <div className='grid grid-cols-2 gap-2' key={index}>
                                <div className='border-b border-dashed h-fit'>{formatDate(release.date)}</div>
                                <div className='flex flex-wrap gap-1 pt-2'>
                                    {release.releases.map((item, index) => (
                                        <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded w-fit' key={index}>{getCountryNameByCode(item.country)}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Releases

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

function getCountryNameByCode(code) {
    const country = countries.find(country => country.iso_3166_1 === code.toUpperCase());
    return country ? country.english_name : "Country not found";
}