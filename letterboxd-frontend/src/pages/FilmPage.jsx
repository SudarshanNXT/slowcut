import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import countries from '../data/countries.js';
import languages from '../data/languages.js';
import AddToListCard from '../components/AddToListCard.jsx';

const FilmPage = () => {
    const { id } = useParams()
    const [movieData, setMovieData] = useState(null);
    const [filter, setFilter] = useState('cast');
    const [loading, setLoading] = useState(true);
    const [likeStatus, setLikeStatus] = useState(false);
    const [watchStatus, setWatchStatus] = useState(false);
    const [watchlistStatus, setWatchlistStatus] = useState(false);
    const [diaryStatus, setDiaryStatus] = useState(false);
    const [reviewStatus, setReviewStatus] = useState(false);
    const [listStatusArr, setListStatusArr] = useState(null);
    const [addToList, setAddToList] = useState(false);
    const [listOfLists, setListofLists] = useState([]);
    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''

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
                    
                    // getUserList()
                }
            } catch (error) {
                console.log(error);
            }
        }
        getMovieDetails()
        if(localStorage.getItem('userInfo')){
            const getMovieStatus = async () => {
                const response = await fetch(`${apiBaseUrl}/profile/movie_status?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                if(response.ok){
                    const data = await response.json()
                    setLikeStatus(data.liked_movie_status)
                    setWatchStatus(data.watch_status)
                    setWatchlistStatus(data.watchlist_status)
                    setDiaryStatus(data.diary_status)
                    setReviewStatus(data.review_status)
                    setListStatusArr(data.list_status_arr)
                    setRating(data.rating_status)
                    console.log(data);
                }
            } 
            getMovieStatus()
        }
    }, [id])

    const addMovieToProfile = async (field, rating = null) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movie_to_profile/${field}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: movieData.movie_data.title,
                    id: movieData.movie_data.id,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    rating: rating
                })
            })
            if(response.ok){
                const data = await response.json()
                if(field === 'liked'){
                    setLikeStatus(true)
                } else if(field === 'watched'){
                    setWatchStatus(true)
                } else if(field === 'watchlist'){
                    setWatchlistStatus(true)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const removeMovieFromProfile = async (field) => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/remove_movie_from_profile/${field}?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                if(field === 'liked'){
                    setLikeStatus(false)
                } else if(field === 'watched'){
                    setWatchStatus(false)
                    setRating(null)
                } else if(field === 'watchlist'){
                    setWatchlistStatus(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addMoviesToLists = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_movies_to_lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: id,
                    list_of_lists: listOfLists,
                    title: movieData.movie_data.title,
                    id: movieData.movie_data.id,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date
                })
            })
            if(response.ok){
                const data = await response.json()
                setAddToList(false)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addDiaryEntry = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/profile/add_diary_entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: id,
                    title: movieData.movie_data.title,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    rewatch: true
                })
            })
            if(response.ok){
                const data = await response.json()
                setDiaryStatus(true)
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addReview = async () => {
        try {
            if(reviewBody.length === 0) return
            const response = await fetch(`${apiBaseUrl}/profile/create_review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movie_id: id,
                    title: movieData.movie_data.title,
                    image: movieData.movie_data.poster_path,
                    genres: movieData.movie_data.genres,
                    release_date: movieData.movie_data.release_date,
                    body: reviewBody
                })
            })
            if(response.ok){
                const data = await response.json()
                setReviewStatus(true)
                setReviewBody('')
            } else {
                const error = await response.json()
                throw new Error(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRatingChange = (event) => {
        const rating = Number(event.target.value)
        setRating(rating)
        addMovieToProfile('watched', rating)
    }

    const handleDeleteRating = () => {
        setRating(null)
        addMovieToProfile('watched')
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

                {localStorage.getItem('userInfo') ? (
                    <>
                        {likeStatus ? (
                            <button onClick={() => removeMovieFromProfile('liked')} className='border'>Unlike</button>
                        ) : (
                            <button onClick={() => addMovieToProfile('liked')} className='border'>Like</button>
                        )}

                        {watchStatus ? (
                            <button onClick={() => removeMovieFromProfile('watched')} className='border'>Watched</button>
                        ) : (
                            <button onClick={() => addMovieToProfile('watched')} className='border'>Watch</button>
                        )}

                        {watchlistStatus ? (
                            <button onClick={() => removeMovieFromProfile('watchlist')} className='border'>Watchlist remove</button>
                        ) : (
                            <button onClick={() => addMovieToProfile('watchlist')} className='border'>Watchlist add</button>
                        )}

                        {/*Rating */}
                        
                        <div>
                            <button onClick={() => handleDeleteRating()} className='bg-red-300'>Delete Rating</button>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <label key={num}>
                                <input
                                    type="radio"
                                    value={num}
                                    checked={rating === num}
                                    onChange={handleRatingChange}
                                />
                                {num}
                                </label>
                            ))}
                        </div>

                        {addToList ? (
                            <div>
                                {listStatusArr.map((list, index) => (
                                    <AddToListCard key={index} list={list.list_item} status={list.status} setListofLists={setListofLists}/>
                                ))}

                                <button className='bg-green-400' onClick={() => addMoviesToLists()}>Add</button>
                            </div>
                        ) : (
                            <button className='border' onClick={() => setAddToList(true)}>Add to list</button>
                        )}

                        {/*Diary entry */}
                        {diaryStatus ? (
                            <button onClick={() => addDiaryEntry()} className='border'>Add to diary again</button>
                        ) : (
                            <button onClick={() => addDiaryEntry()} className='border'>Add to diary</button>
                        )}
                        
                        {/*Review */}
                        <label htmlFor="review_body">{reviewStatus ? 'Review again' : 'Review'}</label>
                        <textarea
                            id="review_body"
                            value={reviewBody}
                            onChange={(e) => setReviewBody(e.target.value)}
                            className='border border-gray-400 bg-primary rounded-md p-2 w-full h-32'
                            placeholder="Enter review..."
                        ></textarea>
                        <button onClick={() => addReview()} className='bg-green-400'>Save</button>
                    </>
                ) : (
                    <div>Log in or sign up</div>
                )}
                

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

function getCountryNameByCode(code) {
    const country = countries.find(country => country.iso_3166_1 === code.toUpperCase());
    return country ? country.english_name : "Country not found";
}

function getLanguageNameByCode(code) {
    const language = languages.find(lang => lang.iso_639_1 === code.toLowerCase());
    return language ? language.english_name : "Language not found";
}

export default FilmPage