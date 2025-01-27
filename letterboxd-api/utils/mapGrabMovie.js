import Movie from "../models/movieModel.js"

const mapGrabMovie = async (items) => {
    return await Promise.all(
        items.map(async item => {
            const movie = await Movie.findById(item.movie)
            item['movie'] = movie
            return item
        })
    )
}

export default mapGrabMovie