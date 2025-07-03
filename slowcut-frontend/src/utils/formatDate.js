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

const formatDate2 = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(date));
};

export {
    formatDate,
    formatDate2
}