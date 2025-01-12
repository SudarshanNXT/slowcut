import asyncHandler from "express-async-handler"

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

export {
    search,
    getFilms
}