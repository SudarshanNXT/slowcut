import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ResultCard from '../components/cards/ResultCard';
import { sortResults } from '../utils/sorting';
import samplePersonData from '../data/samplePersonData';
import MovieCard from '../components/cards/MovieCard';
import Loading from '../components/Loading';

const PersonPage = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [filters, setFilters] = useState(null);
    const [personData, setPersonData] = useState(null);
    const [combinedCredits, setCombinedCredits] = useState(null);
    const [display, setDisplay] = useState(null);
    const [sortingMetric, setSortingMetric] = useState('popularity_desc');
    const [more, setMore] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getPersonDetails = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/tmdb/person_details?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    setPersonData(data);
                    handleFiltering(data.credits_data.crew, data.credits_data.cast, data.person_data.known_for_department)

                    setLoading(false)
                }
            } catch (error) {
                console.error(error);
            }
        }
        getPersonDetails()
    }, [id])

    function handleFiltering(crewArr, castArr, kfd) {
        const jobCounts = {};
        jobCounts['Acting'] = castArr.length
    
        crewArr.forEach(obj => {
            const job = obj.job;
            jobCounts[job] = (jobCounts[job] || 0) + 1;
        });
        
        const arr = Object.entries(jobCounts)

        setFilters(arr)
        //determine the default filter using known for department
        let initialFilter = ''
        if(kfd === 'Acting'){
            initialFilter = arr.find(item => item[0] === 'Acting')
        } else {
            initialFilter = findArrayWithHighestNumber(arr)
        }
        setFilter(initialFilter[0])

        //combine both crewArr and castArr
        const combined = [...crewArr, ...castArr]
        setCombinedCredits(combined)
        //initial filtering of display data
        if(initialFilter[0] === 'Acting'){
            setDisplay(sortResults(sortingMetric, [...castArr]))
        } else {
            const filteredArr = crewArr.filter((item) => item.job === initialFilter[0])
            setDisplay(sortResults(sortingMetric, filteredArr))
        }

        return;
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        if(e.target.value === 'Acting'){
            setDisplay([...personData.credits_data.cast])
        } else {
            setDisplay(personData.credits_data.crew.filter((item) => item.job === e.target.value))
        }
    }

    function findArrayWithHighestNumber(arrays) {
        if (!Array.isArray(arrays) || arrays.length === 0) {
            return null;
        }
        const filteredArrays = arrays.filter(array => array[0] !== "Acting");
        if (filteredArrays.length === 0) {
            return null;
        }
        return filteredArrays.reduce((maxArray, currentArray) => {
            return currentArray[1] > maxArray[1] ? currentArray : maxArray;
        });
    }

    const handleSortingChange = (e) => {
        setSortingMetric(e.target.value)
        setDisplay(sortResults(e.target.value, display))
    } 

    return loading ? (
            <div className='flex justify-center items-center min-h-[calc(90vh-65px)]'>
                <Loading />
            </div>
        ) : (
            <div className='flex flex-col-reverse md:grid grid-cols-4 gap-x-8 px-3 md:px-0 py-3'>
                <div className='col-span-3 space-y-3'>
                    <div>
                        <div className='uppercase text-gray-400 font-semibold'>Films Starring</div>
                        <div className='text-white text-2xl font-bold'>{personData.person_data.name}</div>
                    </div>

                    {/*Sorting/filtering section */}
                    <div className='flex justify-between border-y border-y-gray-300 text-gray-300 py-1'>
                        {filters && filter && filters.length > 0 && 
                            <div className=''>
                                <select className='bg-transparent w-fit outline-none uppercase' value={filter} onChange={handleFilterChange}>
                                    {filters.map((filter, index) => (
                                        <option 
                                            className={`bg-gray-400 text-black`} 
                                            key={index} 
                                            value={filter[0]}>
                                            {filter[0] === 'Acting' ? 'Actor' : filter[0]} {' ' + filter[1]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }

                        <div className=''>
                            <select className='bg-transparent w-fit outline-none' value={sortingMetric} onChange={handleSortingChange}>
                                <option className={`bg-gray-400 text-black`}  value="popularity_desc">Popularity (desc)</option>
                                <option className={`bg-gray-400 text-black`}  value="popularity_asc">Popularity (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_desc">Release Date (desc)</option>
                                <option className={`bg-gray-400 text-black`}  value="release_date_asc">Release Date (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_asc">Title (asc)</option>
                                <option className={`bg-gray-400 text-black`}  value="title_desc">Title (desc)</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                        {display.map((movie, index) => (
                            <MovieCard key={index} movie={movie}/>
                        ))}
                    </div>
                </div>

                <div className='grid grid-cols-3 md:block col-span-1 space-x-3 md:space-x-0'>
                    {personData.person_data.profile_path ? <img className='col-span-1 lg:h-[345px] rounded-md mb-2' src={`https://image.tmdb.org/t/p/w500/${personData.person_data.profile_path}`} alt={personData.person_data.name} /> : (
                        <div className='w-full h-[285px] lg:h-[345px] bg-gray-600 text-gray-300 flex items-center justify-center font-semibold text-center rounded-md'>{personData.person_data.name}</div>
                    )}
                    {personData.person_data.biography && (
                        more && personData.person_data.biography.length > 200 ? (
                            <div className='text-gray-300 col-span-2'>{personData.person_data.biography + ' '}<button onClick={() => setMore(false)} className='text-white hover:text-blue-500'>less</button></div>
                        ) : (
                            <div className='text-gray-300 col-span-2'>{personData.person_data.biography.slice(0, 200) + '... '}<button onClick={() => setMore(true)} className='text-white hover:text-blue-500'>more</button></div>
                        )
                    )}
                </div>
            </div>
        )
}

export default PersonPage