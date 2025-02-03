const listStatusArr = (arr, movie) => {
    if(!movie){
        return arr.map(list_item => {
            const listItemObj = {}
            listItemObj['status'] = false
            listItemObj['list_item'] = list_item
            return listItemObj
        })
    }
    return arr.map(list_item => {
        const listItemObj = {}
        
        listItemObj['status'] = list_item.list_items.some(movie_obj => movie_obj.movie.toString() === movie._id.toString())
        listItemObj['list_item'] = list_item
        return listItemObj
    })
}

export default listStatusArr