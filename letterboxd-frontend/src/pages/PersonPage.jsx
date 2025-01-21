import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ResultCard from '../components/cards/ResultCard';
import { sortResults } from '../utils/sorting';

const PersonPage = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [filters, setFilters] = useState(null);
    const [personData, setPersonData] = useState(null);
    const [combinedCredits, setCombinedCredits] = useState(null);
    const [display, setDisplay] = useState(null);
    const [sortingMetric, setSortingMetric] = useState('popularity_desc');

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
                    // console.log(data);
                    setPersonData(data);
                    handleFiltering(data.credits_data.crew, data.credits_data.cast, data.person_data.known_for_department)

                    setLoading(false)
                    
                    // favoriteStatus = checkFavoriteStatus()
                    // getUserList()
                }
            } catch (error) {
                console.log(error);
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

    if(personData && !loading){
        return (
            <div>
                <img className='h-[150px]' src={`${personData.person_data.profile_path ? `https://image.tmdb.org/t/p/w500/${personData.person_data.profile_path}` : '../images/no-image-1.png'}`} alt={personData.person_data.name} />
                <div>{personData.person_data.name}</div>
                <div>{personData.person_data.biography}</div>

                {/*Filtering dropdown */}
                {filters && filter && filters.length > 0 && 
                    <div className='border'>
                        <select value={filter} onChange={handleFilterChange}>
                            {filters.map((filter, index) => (
                                <option key={index} value={filter[0]}>{filter[0] === 'Acting' ? 'Actor' : filter[0]} {filter[1]}</option>
                            ))}
                        </select>
                    </div>
                }

                {/*Sorting dropdown */}
                <div className='border'>
                    <select value={sortingMetric} onChange={handleSortingChange}>
                        <option value="popularity_desc">Popularity (desc)</option>
                        <option value="popularity_asc">Popularity (asc)</option>
                        <option value="release_date_desc">Release Date (desc)</option>
                        <option value="release_date_asc">Release Date (asc)</option>
                        <option value="title_asc">Title (asc)</option>
                        <option value="title_desc">Title (desc)</option>
                    </select>
                </div>

                <div className='flex flex-wrap'>
                    {display.map((item, index) => (
                        <ResultCard key={index} result={item}/>
                    ))}
                </div>
            </div>
        )
    } else if(!personData && loading){
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div>error</div>
        )   
    }
}

export default PersonPage