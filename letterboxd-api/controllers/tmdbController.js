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
    } else {
        base_url += type
    }

    const response = await fetch(`${base_url}?query=${query}&page=${Number(page)}&include_adult=true`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
    if(response.ok){
        const data = await response.json()
        res.json(data)
        return
    } else {
        res.json('Failed to fetch data')
    }

})

export {
    search
}