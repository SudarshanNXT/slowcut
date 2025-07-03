import React from 'react'
import countries from '../../data/countries.js';
import languages from '../../data/languages.js';

const MovieDetails = ({ production_companies, origin_country, original_language, spoken_languages, alternative_titles }) => {
    return (
        <div className='flex flex-col space-y-2 mt-2 text-gray-300'>
            <div className='grid grid-cols-2 gap-2'>
                <div className='border-b h-fit'>Studios:</div>
                <div className='flex flex-wrap gap-1 pt-2'>
                    {production_companies.map((item, index) => <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded' key={index}>{item.name}</div>)}
                </div>
            </div>

            <div className='grid grid-cols-2 gap-2'> 
                <div className='border-b h-fit'>Country:</div>
                <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded w-fit'>{getCountryNameByCode(origin_country)}</div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
                <div className='border-b h-fit'>Primary Language:</div>
                <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded w-fit'>{getLanguageNameByCode(original_language)}</div>
            </div>

            <div className='grid grid-cols-2 gap-2'> 
                <div className='border-b h-fit'>Spoken Languages:</div>
                <div className='flex flex-wrap gap-1 pt-2'>
                    {spoken_languages.map((item, index) => <div className='bg-gray-900 text-gray-300 text-xs px-2 py-1 rounded w-fit' key={index}>{item.name}</div>)}
                </div>
            </div>

            <div className='grid grid-cols-2 gap-2'> 
                <div className='border-b h-fit'>Alternative Titles:</div>
                <div className='flex flex-wrap gap-1 pt-2'>
                    {alternative_titles.map((item, index) => <div className="text-gray-300 text-xs w-fit" key={index}>{item.title}{index !== alternative_titles.length - 1 && ","}</div>)}
                </div>
            </div>
        </div>
    )
}

export default MovieDetails

function getCountryNameByCode(code) {
    const country = countries.find(country => country.iso_3166_1 === code.toUpperCase());
    return country ? country.english_name : "Country not found";
}

function getLanguageNameByCode(code) {
    const language = languages.find(lang => lang.iso_639_1 === code.toLowerCase());
    return language ? language.english_name : "Language not found";
}