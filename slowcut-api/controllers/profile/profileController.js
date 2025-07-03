import asyncHandler from "express-async-handler"
import User from '../../models/userModel.js'
import Profile from "../../models/profileModel.js"
import Movie from "../../models/movieModel.js"
import List from "../../models/listModel.js"
import listStatusArr from "../../utils/listStatusArr.js"
import { validateUsername } from "../../utils/inputValidation.js"
import mapGrabMovie from "../../utils/mapGrabMovie.js"
import groupByMonth from "../../utils/groupByMonth.js"
import Review from "../../models/reviewModel.js"

// @desc Get Profile Data
// route GET api/profile/get_profile_data
// @access Public
const getProfileData = asyncHandler(async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username: username })
    const profile = await Profile.findOne({ user: user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    //grab last 3 reviews
    const reviews = await Review.find({ creator: user.username }).sort({ created_at: -1 }).limit(3)
    const fullReviews = await mapGrabMovie(reviews)

    //grab last 3 public lists
    const lists = await List.find({ creator: user.username, is_public: true }).sort({ created_at: -1 })
    const fullLists = []
    for(const list of lists){
        const fullListItems = await mapGrabMovie(list.list_items.slice(0, 5))
        let listObject = list.toObject()
        listObject['list_items'] = fullListItems
        listObject['list_items_length'] = list.list_items.length
        fullLists.push(listObject)
    }

    //grab last 3 diary entries
    const diaryEntries = profile.diary.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
    const fullDiaryEntries = await mapGrabMovie(diaryEntries)
    const groupedDiaryEntries = groupByMonth(fullDiaryEntries)
    const diaryEntriesByMonth = Object.values(groupedDiaryEntries)

    //grab favorite films
    const favoriteFilms = profile.favorite_films
    const fullFavoriteFilms = await mapGrabMovie(favoriteFilms)
    while (fullFavoriteFilms.length < 4) {
        fullFavoriteFilms.push(false);
    }

    //grab stats (watched films, number of unique films in diary, number of lists)
    const stats = {}
    stats['watched'] = profile.watched_movies.length || 0
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const thisYearEntries = profile.diary.filter(entry => 
        new Date(entry.added_on) >= startOfYear && new Date(entry.added_on) < endOfYear
    );
    const uniqueMovieIds = new Set(thisYearEntries.map(entry => entry.movie.toString()));
    stats['this_year'] = uniqueMovieIds.size || 0
    stats['lists'] = await List.countDocuments({ creator: username }) || 0
    
    res.json({
        profile: {
            ...profile.toObject(),
            name: profile.name,
            email: profile.email,
            bio: profile.bio
        },
        user: {
            username: user.username,
            // include any other user fields you need
        },
        reviews: fullReviews,
        diary: diaryEntriesByMonth,
        favorite_films: fullFavoriteFilms,
        lists: fullLists,
        stats: stats
    })
})
// @desc Get profile sub Data
// route GET api/profile/get_profile_sub_data
// @access Public
const getProfileSubData = asyncHandler(async(req, res) => {
    const { username, category } = req.params
    const user = await User.findOne({ username: username })
    const profile = await Profile.findOne({ user: user._id })

    if(!user || !profile){
        res.status(404)
        throw new Error('User not found')
    }

    //grab stats
    const stats = {}
    stats['watched'] = profile.watched_movies.length
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const thisYearEntries = profile.diary.filter(entry => 
        new Date(entry.added_on) >= startOfYear && new Date(entry.added_on) < endOfYear
    );
    const uniqueMovieIds = new Set(thisYearEntries.map(entry => entry.movie.toString()));
    stats['this_year'] = uniqueMovieIds.size
    stats['lists'] = await List.countDocuments({ creator: username })

    if(category === 'diary'){
        const diaryEntries = profile.diary.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullDiaryEntries = await mapGrabMovie(diaryEntries)
        const groupedDiaryEntries = groupByMonth(fullDiaryEntries)
        const diaryEntriesByMonth = Object.values(groupedDiaryEntries)

        //get rating, like status, review
        for(const diary_entry of fullDiaryEntries){
            const ratingIndex = profile.watched_movies.findIndex(item => item.movie._id.toString() === diary_entry.movie._id.toString())
            const ratingStatus = ratingIndex !== -1 ? profile.watched_movies[ratingIndex].rating : null
            diary_entry.rating = ratingStatus

            const likedMovieStatus = profile.liked_movies.some(item => item.movie._id.toString() === diary_entry.movie._id.toString())
            diary_entry.like_status = likedMovieStatus

            const review = await Review.findOne({ creator: user.username, movie: diary_entry.movie._id })
            diary_entry.review = review
        }
        
        res.json({
            stats: stats,
            data: diaryEntriesByMonth
        })
        return
    } else if(category === 'watched'){
        const watchedMovies = profile.watched_movies.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullWatchedMovies = await mapGrabMovie(watchedMovies)
        res.json({
            stats: stats,
            data: fullWatchedMovies
        })
        return
    } else if(category === 'watchlist'){
        const watchlist = profile.watchlist.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullWatchlist = await mapGrabMovie(watchlist)
        res.json({
            stats: stats,
            data: fullWatchlist
        })
        return
    } else if(category === 'likes') {
        const likedMovies = profile.liked_movies.sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
        const fullLikedMovies = await mapGrabMovie(likedMovies)
        res.json({
            stats: stats,
            data: fullLikedMovies
        })
        return
    } else if(category === 'reviews'){
        const reviews = await Review.find({ creator: username }).sort({ created_at: -1 })
        const fullReviews = await mapGrabMovie(reviews)
        res.json({
            stats: stats,
            data: fullReviews
        })
        return
    } else if(category === 'lists'){
        const lists = await List.find({ creator: username }).sort({ created_at: -1 })
        const arr = []
        for(const list of lists){
            //grab movie data for each list
            const fullListItems = await mapGrabMovie(list.list_items)
            let listObject = list.toObject()
            listObject['list_items'] = fullListItems
            listObject['list_items_length'] = list.list_items.length
            arr.push(listObject)
        }
        res.json({
            stats: stats,
            data: arr
        })
        return
    }

    res.json('hooked up')
})

// @desc Update Profile (username)
// route PUT api/profile/update_profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const { new_username, name, email, bio, age } = req.body;
    const user = await User.findById(req.user._id);
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile || !user) {
        res.status(404);
        throw new Error('User not found');
    }

    // If username is being changed, validate it
    if (new_username && new_username !== user.username) {
        const usernameValidation = validateUsername(new_username);
        if (!usernameValidation.isValid) {
            res.status(400);
            throw new Error(usernameValidation.error);
        }
        
        // Check if new username is available
        const userExists = await User.findOne({ username: new_username });
        if (userExists) {
            res.status(400);
            throw new Error('Username already taken');
        }

        // Update username
        user.username = new_username;
        await user.save();
    }

    // Update profile fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (age !== undefined) updates.age = age;

    if (Object.keys(updates).length > 0) {
        await Profile.updateOne({ user: req.user._id }, { $set: updates });
    }

    // Get updated profile
    const updatedProfile = await Profile.findOne({ user: req.user._id });

    res.json({
        success: true,
        new_username: user.username,
        profile: {
            name: updatedProfile.name,
            email: updatedProfile.email,
            bio: updatedProfile.bio,
            age: updatedProfile.age
        }
    });
});

// @desc Add favorite film to profile
// route POST api/profile/add_favorite_film
// @access Private
const addFavoriteFilm = asyncHandler(async (req, res) => {
    const { title, id, image, genres, release_date, index } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //check if movie is already in db, if not then create it
    let movie = await Movie.findOne({ id: id })
    if(!movie){
        movie = await Movie.create({
            title: title,
            id: id,
            image: image,
            genres: genres,
            release_date: release_date
        })
    }

    //add to profile's favorite films
    if(profile.favorite_films.length < 4){
        profile.favorite_films.push({
            movie: movie._id,
            id: movie.id
        })
        await profile.save()
        res.json(`${movie.title} added to ${user.username}'s favorite films`)
    } else if(index !== undefined && index !== null){
        profile.favorite_films[index] = { movie: movie._id, id: movie.id }
        await profile.save()
        res.json(`${movie.title} added to ${user.username}'s favorite films`)
    } else {
        res.status(404)
        throw new Error('Only 4 films can be favorited')
    }
})

// @desc Delete favorite film from profile
// route DELETE api/profile/delete_favorite_film
// @access Private
const deleteFavoriteFilm = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //grab the movie
    const movie = await Movie.findOne({ id: id })
    
    if(!movie){
        res.status(404)
        throw new Error('Error deleting movie')
    }

    //delete from profile's favorite films
    const index = profile.favorite_films.findIndex(item => item.movie._id.toString() === movie._id.toString())
    profile.favorite_films.splice(index, 1)
    await profile.save()

    res.json(`${movie.title} removed from ${user.username}'s watched movies`)
})

// @desc Update favorite films
// route PUT api/profile/update_favorite_films
// @access Private
const updateFavoriteFilms = asyncHandler(async (req, res) => {
    const { favorite_films } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    //update favorite films in profile
    const newFavoriteFilms = []
    for(const favorite_film of favorite_films){
        if(favorite_film){
            const obj = {
                'movie': favorite_film.movie._id,
                'id': favorite_film.id
            }
            newFavoriteFilms.push(obj)
        }
    }
    profile.favorite_films = newFavoriteFilms
    await profile.save()

    res.json('Successfully updated favorite films')
})

// @desc Get pre display data (array of movies)
// route POST api/profile/get_pre_display_data
// @access Private
const getPreDisplayData = asyncHandler(async (req, res) => {
    const { data, two_dimension } = req.body
    const user = await User.findById(req.user._id)
    const profile = await Profile.findOne({ user: req.user._id })

    if(!profile || !user){
        res.status(404)
        throw new Error('User not found')
    }

    if(!data || data.length === 0){
        res.status(404)
        throw new Error('No data to fetch')
    }

    //iterate through data (check for 2d array)
    if(two_dimension){
        for(const month of data){
            await Promise.all(month.map(async (entry) => {
                try {
                    const movie = await Movie.findById(entry.movie._id);
    
                    if (movie) { 
                        const likedMovieStatus = profile.liked_movies.some(
                            item => item.movie._id.toString() === movie._id.toString()
                        );
                        const watchMovieStatus = profile.watched_movies.some(
                            item => item.movie._id.toString() === movie._id.toString()
                        );
    
                        entry.user_like_status = likedMovieStatus;
                        entry.user_watch_status = watchMovieStatus;
                    }
                } catch (error) {
                    console.error(`Error fetching movie with ID ${entry.movie._id}:`, error);
                }
            }));
        }
        res.json(data)
        return
    } else {
        await Promise.all(data.map(async (movie) => {
            try {
                const movie = await Movie.findById(movie._id);
                if (movie) {  
                    const likedMovieStatus = profile.liked_movies.some(
                        item => item.movie._id.toString() === movie._id.toString()
                    );
                    const watchMovieStatus = profile.watched_movies.some(
                        item => item.movie._id.toString() === movie._id.toString()
                    );

                    entry.user_like_status = likedMovieStatus;
                    entry.user_watch_status = watchMovieStatus;
                }
            } catch (error) {
                console.error(`Error fetching movie with ID ${movie._id}:`, error);
            }
        }))
        res.json(data)
        return
    }
})

export {
    getProfileData,
    getProfileSubData,
    updateProfile,
    addFavoriteFilm,
    deleteFavoriteFilm,
    updateFavoriteFilms,
    getPreDisplayData
}