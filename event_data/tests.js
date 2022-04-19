/* eslint-disable no-unused-vars */

const {
    logAll,
    getAllEvents,
    getAllEventsWithId,
    getAllEventsWithName,
    getAllEventsOnDate,
    filterEventsAfterTime,
    sortEventsByTime,
} = require('./eventData.js');

// getAllEvents(true);
// getAllEventsWithId(4003, true);
// getAllEventsWithName("Proving Grounds Deathmatch", true);
// getAllEventsOnDate(4, 18, true);

let collection = getAllEventsWithId(4005, true);
collection = filterEventsAfterTime(collection, 1500, true);
sortEventsByTime(collection, true);
