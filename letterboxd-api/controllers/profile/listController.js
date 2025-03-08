import asyncHandler from "express-async-handler"
import User from "../../models/userModel.js"
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"
import { getGenreObjects } from "../../utils/getGenres.js"

// @desc Create new list
// route POST api/profile/create_list
// @access Private
const createList = asyncHandler(async (req, res) => {
    const { name, description, ranked, is_public, list_items } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //input validation
    if(name.length > 100){
        res.status(400)
        throw new Error('List name too long.')
    }

    //create list
    const list = await List.create({
        name: name,
        description: description,
        creator: user.username,
        ranked: ranked,
        is_public: is_public,
        comments: [],
        list_items: []
    })

    //iterate through list items, adding each to list
    for(const list_item of list_items){
        let movie = await Movie.findOne({ id: list_item.id })
        if(!movie){
            movie = await Movie.create({
                title: list_item.title,
                id: list_item.id,
                image: list_item.poster_path,
                genres: getGenreObjects(list_item.genres),
                release_date: list_item.release_date
            })
        }

        list.list_items.push({
            movie: movie._id,
            type: 'Movie',
            id: movie.id
        })
    }
    await list.save()

    res.json({
        list: list
    })
})

// @desc Update List Data
// route PUT api/profile/update_list_data
// @access Private
const updateListData = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, description, ranked, is_public, list_items } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })
    const list = await List.findById(id)

    if(!profile || !user || !list){
        res.status(404)
        throw new Error('User or list not found')
    }

    //input validation
    if(name.length > 50){
        res.status(400)
        throw new Error('List name too long.')
    }

    //update data
    list.name = name
    list.description = description,
    list.ranked = ranked,
    list.is_public = is_public

    //update list items
    const newListItems = []
    for(const list_item of list_items){
        const movie = await Movie.findById(list_item._id)
        const obj = {
            'movie': list_item._id,
            'type': 'Movie',
            'id': movie.id
        }
        newListItems.push(obj)
    }
    list.list_items = newListItems

    await list.save()
    res.json(`${list.name} updated successfully`)

})

// @desc Delete a list
// route DELETE api/profile/delete_list
// @access Private
const deleteList = asyncHandler(async (req, res) => {
    const { id } = req.params
    const list = await List.findById(id)
    const listName = list.name

    if(!list){
        res.status(404)
        throw new Error('List not found')
    }

    await list.deleteOne()
    res.json(`${listName} deleted successfully`)
})

// @desc Add movies to lists (receives list of lists)
// route POST api/profile/add_movies_to_lists
// @access Private
const addMoviesToLists = asyncHandler(async (req, res) => {
    const { movie_id, list_of_lists, title, id, image, genres, release_date } = req.body

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: movie_id })
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    }

    //iterate through list of lists and add movie to each
    for (const list_id of list_of_lists) {
        const list = await List.findById(list_id);
        list.list_items.push({
            movie: movie._id,
            type: 'Movie',
            id: movie.id
        })
        await list.save()
      }

    res.json('Movies added to lists successfully')
})

// @desc Remove movie from list 
// route DELETE api/profile/remove_movie_from_list
// @access Private
const removeMovieFromList = asyncHandler(async (req, res) => {
    const { list_id, movie_id } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //find the list
    const list = await List.findById(list_id)
    if(!list){
        res.status(404)
        throw new Error('List not found')
    }

    //check if user from request is the creator of the list
    if(list.creator !== user.username){
        res.status(404)
        throw new Error('Unauthorized')
    }

    //find the movie
    const movie = await Movie.findById(movie_id)
    if(!movie){
        res.status(404)
        throw new Error('Movie not found')
    }

    const index = list.list_items.findIndex(list_item => list_item.movie.toString() === movie._id.toString())
    if(index !== -1){
        list.list_items.splice(index, 1)
        await list.save()
    }
    res.json(`${movie.title} removed from ${list.name}`)
})

// @desc Get List Data
// route GET api/profile/get_list_data
// @access Public
const getListData = asyncHandler(async (req, res) => {
    const { id } = req.params

    const list = await List.findById(id)
    if(!list){
        res.status(404)
        throw new Error('List not found')
    }

    //iterate through list items and grab movie data for each
    const arr = []
    for(const [index, movie_id] of list.list_items.entries()){
        const movie = await Movie.findById(movie_id.movie) 
        const movieObject = movie.toObject()
        movieObject['added_on'] = movie_id.added_on
        movieObject['order'] = index
        arr.push(movieObject)
    }

    res.json({
        list: list,
        movies: arr
    })
})

export {
    createList,
    updateListData,
    deleteList,
    addMoviesToLists,
    removeMovieFromList,
    getListData,
}