const formatDate = (isoString) => {
    const date = new Date(isoString);
    
    // Define month names
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Extract day, month, and year
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `Added ${day} ${month} ${year}`;
};

export {
    formatDate
}