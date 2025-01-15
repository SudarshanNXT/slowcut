import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import countries from '../data/countries.js';
import languages from '../data/languages.js';

const FilmPage = () => {
    const { id } = useParams()
    const [movieData, setMovieData] = useState(null);
    const [filter, setFilter] = useState('cast');
    const [loading, setLoading] = useState(true);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/tmdb/movie_details?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(response.ok){
                    const data = await response.json()
                    // console.log(data);
                    setMovieData(data);
                    setLoading(false)
                    
                    // favoriteStatus = checkFavoriteStatus()
                    // getUserList()
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMovieDetails()
    }, [id])

    function getCountryNameByCode(code) {
        const country = countries.find(country => country.iso_3166_1 === code.toUpperCase());
        return country ? country.english_name : "Country not found";
    }

    function getLanguageNameByCode(code) {
        const language = languages.find(lang => lang.iso_639_1 === code.toLowerCase());
        return language ? language.english_name : "Language not found";
    }

    if(movieData && !loading){
        return (
            <div>
                <img className='h-[150px]' src={`${movieData.movie_data.poster_path ? `https://image.tmdb.org/t/p/w500/${movieData.movie_data.poster_path}` : '../images/no-image-1.png'}`} alt={movieData.movie_data.title} />
                <div>{movieData.movie_data.title}</div>
                <div>{movieData.movie_data.release_date.slice(0, 4)}</div>
                <div>Directed by <Link className='text-blue-500 hover:underline' to={`/person/${movieData.director.id}`}>{movieData.director.name}</Link></div>
                <div>{movieData.movie_data.tagline}</div>
                <div>{movieData.movie_data.overview}</div>

                {/*Filtered section */}
                <div className='border'>
                    <div className='flex space-x-2'>
                        <button onClick={() => setFilter('cast')} className={`${filter === 'cast' ? 'bg-blue-400' : ''}`}>Cast</button>
                        <button onClick={() => setFilter('crew')} className={`${filter === 'crew' ? 'bg-blue-400' : ''}`}>Crew</button>
                        <button onClick={() => setFilter('details')} className={`${filter === 'details' ? 'bg-blue-400' : ''}`}>Details</button>
                        <button onClick={() => setFilter('genres')} className={`${filter === 'genres' ? 'bg-blue-400' : ''}`}>Genres</button>
                        <button onClick={() => setFilter('releases')} className={`${filter === 'releases' ? 'bg-blue-400' : ''}`}>Releases</button>
                    </div>

                    {filter === 'cast' &&
                        movieData.credits.cast.map((item, index) => (
                            <div key={index}>{item.name}</div>
                        ))
                    }
                    {filter === 'crew' &&
                        movieData.credits.crew.map((item, index) => (
                            <div key={index}>{item.name}</div>
                        ))
                    }
                    {filter === 'details' &&
                        <div>
                            <div>Studios: {movieData.movie_data.production_companies.map((item, index) => <div key={index}>{item.name}</div>)}</div>
                            <div className='border'>Country: {getCountryNameByCode(movieData.movie_data.origin_country[0])}</div>
                            <div>Primary Language: {getLanguageNameByCode(movieData.movie_data.original_language)}</div>
                            <div>Spoken Languages: {movieData.movie_data.spoken_languages.map((item, index) => <div key={index}>{item.name}</div>)}</div>
                            <div>Alternative Titles: {movieData.alternative_titles.titles.map((item, index) => <div key={index}>{item.title}</div>)}</div>
                        </div>
                    }
                    {filter === 'genres' && (
                        <>
                            <div className='underline'>Genres:</div>
                            {movieData.movie_data.genres.map((item, index) => (
                                <div key={`genre-${index}`}>{item.name}</div>
                            ))}

                            <div className='underline'>Keywords:</div>
                            {movieData.keywords.keywords.map((keyword, index) => (
                                <div key={`keyword-${index}`}>{keyword.name}</div>
                            ))}
                        </>
                    )}
                    {filter === 'releases' && 
                        movieData.releases.results.map((item, index) => <div key={index}>{item.release_dates[0].release_date.slice(0, 4)} {getCountryNameByCode(item.iso_3166_1)}</div>)
                    }
                </div>
            </div>
        )
    } else if(!movieData && loading){
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div>error</div>
        )   
    }
    
}

export default FilmPage