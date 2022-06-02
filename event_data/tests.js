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
    filterEventsOnDate
} = require('./eventData.js');

// getAllEvents(true);
// getAllEventsWithId(4003, true);
// getAllEventsWithName("Proving Grounds Deathmatch", true);
// const today = getAllEventsOnDate(5, 29);

// let collection =       getAllEventsWithId(4005, true);
// collection =        filterEventsAfterTime(collection, "04171500", true);
// sortEventsByTime(collection, true);

const today = new Date();
const [month, date, time] = [
    `${today.getMonth() + 1}`.padStart(2, '0'),
    `${today.getDate()}`.padStart(2, '0'),
    `${today.getHours()}`.padStart(2, '0') + `${today.getMinutes()}`.padStart(2, '0')
];

const datetime = month + date + time;
let islandTimes = getAllEventsOfType('Adventure Island');
islandTimes = filterEventsOnDate(islandTimes, today.getMonth() + 1, today.getDate());
islandTimes = filterEventsAfterTime(islandTimes, datetime);

const outputIslands = [...new Set(islandTimes.map(laEvent => laEvent.name))];
const outputTimes = [...new Set(islandTimes.map(laEvent => laEvent.time))];

console.log(outputIslands);
console.log(outputTimes);

