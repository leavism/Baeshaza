/* eslint-disable no-unused-vars */

const {
    logAll,
    getAllEventNamesOfType,
    getAllEvents,
    getAllEventsWithId,
    getAllEventsWithName,
    getAllEventsOnDate,
    getAllEventsOfType,
    filterEventsAfterTime,
    sortEventsByTime,
} = require('./eventData.js');

// getAllEvents(true);
// getAllEventsWithId(4003, true);
// getAllEventsWithName("Proving Grounds Deathmatch", true);
// getAllEventsOnDate(4, 18, true);

// let collection =       getAllEventsWithId(4005, true);
// collection =        filterEventsAfterTime(collection, "04171500", true);
// sortEventsByTime(collection, true);

getAllEventNamesOfType("Adventure Island", true);
let islandTimes = getAllEventsOfType("Adventure Island", true);
islandTimes = filterEventsAfterTime(islandTimes, "04191500", true);
