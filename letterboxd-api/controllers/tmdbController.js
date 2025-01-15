import asyncHandler from "express-async-handler"
import findDirector from "../utils/findDirector.js"

// @desc TMDB search query
// route GET api/tmdb/search
// @access Public
const search = asyncHandler(async (req, res) => {
    const { query, type, page } = req.query

    //attach path param
    let base_url = 'https://api.themoviedb.org/3/search/'
    if(type === ''){
        base_url += 'multi'
    } else if(type === 'films') {
        base_url += 'movie'
    } else if(type === 'person'){
        base_url += 'person'
    }

    const response = await fetch(`${base_url}?query=${query}&page=${Number(page)}&include_adult=true`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok){
        const data = await response.json()
        const filteredResults = data.results.filter(item => item.media_type !== 'tv');
        data['results'] = filteredResults
        //filter out tv shows

        //update data

        res.json(data)
        return
    } else {
        res.json('Failed to fetch data')
    }

})

// @desc Get movies based off of type filter and page number
// route GET api/tmdb/films
// @access Public
const getFilms = asyncHandler(async (req, res) => {
    const { type, page } = req.query
    
    const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?page=${page}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok){
        const data = await response.json()
        res.json(data)
        return
    }
    res.status(401)
    res.json('Error fetching movie page data')
})

// @desc Get individual movie page details
// route GET api/users/movie_details
// @access Public
const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.query
    const resObject = {}
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
    }

    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
        headers
    })
    if(response.ok){
        const data = await response.json()
        resObject['movie_data'] = data
    }
    const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        headers
    })
    if(castResponse.ok){
        const data = await castResponse.json()
        resObject['credits'] = data
        resObject['director'] = findDirector(data.crew)
    }

    const altTitlesResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/alternative_titles`, {
        headers
    })
    if(altTitlesResponse.ok){
        const data = await altTitlesResponse.json()
        resObject['alternative_titles'] = data
    }

    const releasesResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates`, {
        headers
    })
    if(releasesResponse.ok){
        const data = await releasesResponse.json()
        resObject['releases'] = data
    }

    const keywordsResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/keywords`, {
        headers
    })
    if(keywordsResponse.ok){
        const data = await keywordsResponse.json()
        resObject['keywords'] = data
    }

    res.json(resObject)
})

// @desc Get individual person page details
// route GET api/users/person_details
// @access Public
const getPersonDetails = asyncHandler(async (req, res) => {
    const { id } = req.query
    const resObject = {}

    const response = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok){
        const data = await response.json()
        resObject['person_data'] = data
    }
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(creditsResponse.ok){
        const data = await creditsResponse.json()
        resObject['credits_data'] = data
    }

    res.json(resObject)
})

export {
    search,
    getFilms,
    getMovieDetails,
    getPersonDetails
}