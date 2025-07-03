function sortResults(metric, arr) {
    if (metric === 'popularity_desc') {
        return arr.sort((a, b) => b.popularity - a.popularity); // Descending: High to Low
    } else if (metric === 'popularity_asc') {
        return arr.sort((a, b) => a.popularity - b.popularity); // Ascending: Low to High
    } else if (metric === 'rating_desc') {
        return arr.sort((a, b) => b.vote_average - a.vote_average); // Descending: High to Low
    } else if (metric === 'rating_asc') {
        return arr.sort((a, b) => a.vote_average - b.vote_average); // Ascending: Low to High
    } else if (metric === 'release_date_desc') {
        return arr.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Descending: Latest to Earliest
    } else if (metric === 'release_date_asc') {
        return arr.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)); // Ascending: Earliest to Latest
    } else if (metric === 'title_desc') {
        return arr.sort((a, b) => b.title.localeCompare(a.title)); // Descending: Z to A
    } else if (metric === 'title_asc') {
        return arr.sort((a, b) => a.title.localeCompare(b.title)); // Ascending: A to Z
    } else if(metric === 'list_order'){
        return arr.sort((a, b) => a.order - b.order)
    } else if(metric === 'reverse_order'){
        return arr.sort((a, b) => b.order - a.order)
    }
}


export {
    sortResults
}