const groupByMonth = (entries) => {
    return entries.reduce((acc, entry) => {
        const date = new Date(entry.added_on);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM format
        
        if (!acc[key]) acc[key] = []; // Create a new array if not exists
        acc[key].push(entry); // Push entry to the correct month group
        
        return acc;
    }, {});
};

export default groupByMonth