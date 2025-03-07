import asyncHandler from "express-async-handler"
import findDirector from "../utils/findDirector.js"
import { getGenres } from "../utils/getGenres.js"
import Review from "../models/reviewModel.js"
import mapGrabMovie from "../utils/mapGrabMovie.js"
import List from "../models/listModel.js"

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

    const response = await fetch(`${base_url}?query=${query}&page=${Number(page)}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok){
        const data = await response.json()
        const filteredResults = data.results.filter(item => item.media_type !== 'tv');

        //get genres for each film
        const updatedResults = filteredResults.map(result => ({
            ...result,
            genres: getGenres(result.genre_ids) 
        }));

        data['results'] = updatedResults

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

        // Group crew members by job
        const crewByJob = data.crew.reduce((acc, member) => {
            if (!acc[member.job]) {
                acc[member.job] = [];
            }
            acc[member.job].push(member);
            return acc;
        }, {});

        const jobPriority = ["Director", "Producer", "Writer", "Casting", "Editor", "Director of Photography"];
        
        resObject["grouped_crew"] = Object.entries(crewByJob)
            .map(([job, members]) => ({ job, members }))
            .sort((a, b) => {
                const indexA = jobPriority.indexOf(a.job);
                const indexB = jobPriority.indexOf(b.job);
                
                if (indexA === -1 && indexB === -1) return 0; 
                if (indexA === -1) return 1; 
                if (indexB === -1) return -1; 
                return indexA - indexB; 
            });
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

        const releaseTypes = {
            1: 'Premiere',
            2: 'Theatrical Limited',
            3: 'Theatrical',
            4: 'Digital',
            5: 'Physical',
            6: 'TV' 
        }

        const groupedReleases = {};
        // Step 1: Group releases by type and then by release date
        data.results.forEach(result => {
            result.release_dates.forEach(release => {
                const typeName = releaseTypes[release.type]; // Get type name from releaseTypes

                if (!typeName) return; // Skip unknown types

                if (!groupedReleases[typeName]) {
                    groupedReleases[typeName] = {};
                }

                // Group by release date
                if (!groupedReleases[typeName][release.release_date]) {
                    groupedReleases[typeName][release.release_date] = [];
                }

                groupedReleases[typeName][release.release_date].push({
                    country: result.iso_3166_1,
                    date: release.release_date
                });
            });
        });

        // Step 2: Convert grouped object into an ordered array, and sort by date
        const orderedReleases = Object.entries(releaseTypes)
            .map(([type, name]) => ({
                type: name,
                releases: Object.entries(groupedReleases[name] || {})
                    .map(([releaseDate, releases]) => ({
                        date: releaseDate,
                        releases: releases
                    }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
            }))
            .filter(group => group.releases.length > 0); // Remove empty groups

        resObject['releases'] = orderedReleases;
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

// @desc Get home page tmdb data (trending and popular movies, no filtering)
// route GET api/tmdb/home_page
// @access Public
const getHomePageData = asyncHandler(async (req, res) => {
    const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
    const resObject = {}
    const movieSet = new Set()

    const popularResponse = await fetch(`https://api.themoviedb.org/3/movie/popular`, {headers})
    if(popularResponse.ok){
        const data = await popularResponse.json()
        const sortedPopularResults = data.results.sort((a, b) => b.popularity - a.popularity).slice(0, 6)
        for(const movie of sortedPopularResults){
            movieSet.add(movie.id)
        }
        resObject['popular_data'] = sortedPopularResults
    }

    const trendingResponse = await fetch(`https://api.themoviedb.org/3/trending/movie/day`, {headers})
    if(trendingResponse.ok){
        const data = await trendingResponse.json()
        const sortedTrendingResults = data.results.sort((a, b) => b.popularity - a.popularity)
        //get first 6 movies that don't also appear in popular movies
        let arr = []
        let i = 0
        while(arr.length < 6 && i < sortedTrendingResults.length){
            if(!movieSet.has(sortedTrendingResults[i].id)){
                arr.push(sortedTrendingResults[i])
            }
            i++
        }

        resObject['trending_data'] = arr
    }

    //get reviews and lists for home page display
    const review_ids = ['67cb27d8c25238a0f6ee09c1', '67cb36cfec0afa0e72d98c39', '67cb3887ec0afa0e72d98cf2']
    const list_ids = ['67cb3336ec0afa0e72d98942', '67cb37d2ec0afa0e72d98c56', '67cb38d1ec0afa0e72d98d0f']
    const reviews = [], lists = []
    for(const review_id of review_ids){
        const review = await Review.findById(review_id) 
        reviews.push(review)
    }
    for(const list_id of list_ids){
        const list = await List.findById(list_id)
        const fullListItems = await mapGrabMovie(list.list_items)
        let listObject = list.toObject()
        listObject['list_items'] = fullListItems
        listObject['list_items_length'] = list.list_items.length
        lists.push(listObject)
    }
    const fullReviews = await mapGrabMovie(reviews)
    resObject['reviews'] = fullReviews
    resObject['lists'] = lists

    res.json(resObject)
})

// @desc Get director for a particular movie
// route GET api/tmdb/get_director/:id
// @access Public
const getDirector = asyncHandler(async (req, res) => {
    const { id } = req.params
    let director = ''

    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok) {
        const data = await response.json()
        director = findDirector(data.crew)
    } else {
        res.status(404)
        throw new Error('Error fetching director')
    }

    res.json(director)
})

export {
    search,
    getFilms,
    getMovieDetails,
    getPersonDetails,
    getHomePageData,
    getDirector
}