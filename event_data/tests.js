/* eslint-disable no-unused-vars */
const {
    logAll,
    getAllEvents,
    getAllEventsById,
    getAllEventsByName,
    getAllEventsOnDate,
    filterEventsAfterTime,
    sortEventsByTime,
} = require('./eventData.js');

// getAllEvents(true);
// getAllEventsById(4003, true);
// getAllEventsByName("Proving Grounds Deathmatch", true);
// getAllEventsOnDate(4, 18, true);

let collection = getAllEventsById(4005, true);
collection = filterEventsAfterTime(collection, 1500, true);
sortEventsByTime(collection, true);
