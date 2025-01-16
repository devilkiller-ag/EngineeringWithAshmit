// Function to format date as "2022-02-08" (Standard ISO format)
function formatDateStandard(isoDate) {
    const date = new Date(isoDate);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Function to format date as "16th January, 2025"
function formatDateWithOrdinal(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();

    // Get ordinal suffix for the day
    const ordinal = (day) => {
        if (day > 3 && day < 21) return 'th'; // Special case for 11th-13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const options = { month: 'long', year: 'numeric' };
    const formattedDate = `${day}${ordinal(day)} ${date.toLocaleDateString('en-US', options)}`;
    return formattedDate;
}

// Function to format date as "Feb. 8, 2022"
function formatDateAbbreviated(isoDate) {
    const date = new Date(isoDate);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options); // Convert comma to a period
    return formattedDate;
}


module.exports = {
    formatDateStandard,
    formatDateWithOrdinal,
    formatDateAbbreviated,
};
