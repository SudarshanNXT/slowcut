import React from 'react'
import countries from '../../data/countries.js';
import ReactCountryFlag from "react-country-flag"

const Releases = ({ releases }) => {
    return (
        <div className='flex flex-col space-y-2 mt-2 text-gray-300'>
            {releases.map((release_type, index) => (
                <div key={index}>
                    <div className='border-b-2 h-fit'>{release_type.type}</div>
                    <div>
                        {release_type.releases.map((release, index) => (
                            <div className='grid grid-cols-2 gap-2 mt-2' key={index}>
                                <div className='border-b border-dashed h-fit'>{formatDate(release.date)}</div>
                                <div className='flex flex-wrap gap-y-3 gap-x-4 pt-3'>
                                    {release.releases.map((item, index) => (
                                        <div className='text-gray-300 text-sm rounded w-fit inline-flex items-center' key={index}>
                                            <ReactCountryFlag 
                                                    countryCode={item.country} 
                                                    svg  
                                                    style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1em',
                                                }}/>
                                            <span className='ml-2 font-semibold'>{getCountryNameByCode(item.country)}</span>
                                        </div>
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