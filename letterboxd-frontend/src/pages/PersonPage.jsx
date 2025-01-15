import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import ResultCard from '../components/ResultCard';

const PersonPage = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [personData, setPersonData] = useState(null);

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
                    console.log(data);
                    setPersonData(data);
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

    if(personData && !loading){
        return (
            <div>
                <img className='h-[150px]' src={`${personData.person_data.profile_path ? `https://image.tmdb.org/t/p/w500/${personData.person_data.profile_path}` : '../images/no-image-1.png'}`} alt={personData.person_data.name} />
                <div>{personData.person_data.name}</div>
                <div>{personData.person_data.biography}</div>

                {personData.credits_data.cast.map((item, index) => (
                    <ResultCard key={index} result={item}/>
                ))}
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