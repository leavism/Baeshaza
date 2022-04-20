const months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
};

// Easier to just cache this since it's very inefficient to generate from the dataset
const adventureIslands = [
    "Medeia",
    "Opportunity Isle",
    "Tranquil Isle",
    "Oblivion Isle",
    "Asura Island",
    "Drumbeat Island",
    "Forpe",
    "Snowpang Island",
    "Phantomwing Island",
    "Volare Island",
    "Lagoon Island",
    "Lush Reed Island",
    "Monte Island",
    "Harmony Island"
]

module.exports = { months, adventureIslands };
