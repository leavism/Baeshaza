/* eslint-disable no-unused-vars */

/* Unused data files
const itemMap = require("./data/itemMapping.json");
const itemRarity = require("./data/itemRarity.json");
const merchants = require("./data/merchants.json");
const merchantSchedules = require("./data/merchantSchedules.json");
*/

const eventData = require('./data/data.json');
const eventNames = require('./data/events.json');
const eventTypes = require('./data/msgs.json')[0];
const { months, adventureIslands } = require('./constants.js');

const util = require('util');

class LAEvent {
    constructor(id, month, day, time) {
        this.id = id;
        this.month = month;
        this.day = day;
        this.time = time;
    }

    [util.inspect.custom](depth, opts) {
    // Gives the class a custom string representation when logging to the console.
        return `Event: ${getEventName(this.id)}, ID: ${this.id}, Date: ${
            months[this.month]
        } ${this.day}, Time: ${this.time}`;
    }
}

function logAll() {
    Object.entries(eventData).forEach((eventType) => {
        const [type, monthDayMap] = eventType;
        console.log('Event Type: ', eventTypes[type]);
        for (const [month, days] of Object.entries(monthDayMap)) {
            for (const [day, events] of Object.entries(days)) {
                console.log('Date: ', months[month], day);
                console.log('***Events***');
                for (const [iLvl, event] of Object.entries(events)) {
                    console.log('iLvl: ', iLvl);
                    for (const [eventId, eventTimes] of Object.entries(event)) {
                        console.log('Event: ', eventNames[parseInt(eventId)][0]);
                        console.log('Time: ', eventTimes);
                    }
                }
            }
        }
    });
}

function getEventName(id) {
    return eventNames[id][0];
}

function getAllEventNamesOfType(eventType_, log = false){
    // provide a string name of the event type, e.g. "Adventure Island"

    let outputNames;
    if (eventType_ == "Adventure Island"){
        // Easier to just cache this since it's very inefficient to generate from the dataset
        outputNames = adventureIslands;
    } else {
        let eventIds = new Set();
    
        Object.entries(eventData).forEach((eventType) => {
            const [type, monthDayMap] = eventType;
            if (eventTypes[type][0] != eventType_){
                return; // continue the loop
            }
            for (const [month, days] of Object.entries(monthDayMap)) {
                for (const [day, events] of Object.entries(days)) {
                    for (const [iLvl, event] of Object.entries(events)) {
                        for (const [eventId, eventTimes] of Object.entries(event)) {
                            eventIds.add(eventId);
                        }
                    }
                }
            }
        });
        
        outputNames = [];
        eventIds.forEach((eventId) => {
            outputNames.push(eventNames[eventId][0]);
        })
    }


    if (log) {
        console.log(`Retrieved all event names of type ${eventType_}:`);
        outputNames.forEach((eventName) => {
            console.log(eventName);
        });
    }
    
    // Returns an array of string names
    return outputNames;
}

function getAllEvents(log = false) {
    let outputEvents = [];

    Object.entries(eventData).forEach((eventType) => {
        const [type, monthDayMap] = eventType;
        for (const [month, days] of Object.entries(monthDayMap)) {
            for (const [day, events] of Object.entries(days)) {
                for (const [iLvl, event] of Object.entries(events)) {
                    for (const [eventId, eventTimes] of Object.entries(event)) {
                        eventTimes.forEach((individualTime) => {
                            outputEvents.push(
                                new LAEvent(eventId, month, day, individualTime)
                            );
                        });
                    }
                }
            }
        }
    });

    if (log) {
        console.log('Retrieved all events:');
        outputEvents.forEach((event) => {
            console.log(event);
        });
    }

    return outputEvents;
}

function getAllEventsOfType(eventType_, log = false){
    // provide a string name of the event type, e.g. "Adventure Island"
    let outputEvents = [];

    Object.entries(eventData).forEach((eventType) => {
        const [type, monthDayMap] = eventType;
        if (eventTypes[type][0] != eventType_){
            return; // continue the loop
        }
        for (const [month, days] of Object.entries(monthDayMap)) {
            for (const [day, events] of Object.entries(days)) {
                for (const [iLvl, event] of Object.entries(events)) {
                    for (const [eventId, eventTimes] of Object.entries(event)) {
                        eventTimes.forEach((individualTime) => {
                            outputEvents.push(
                                new LAEvent(eventId, month, day, individualTime)
                            );
                        });
                    }
                }
            }
        }
    });

    if (log) {
        console.log(`Retrieved all events of type ${eventType_}:`);
        outputEvents.forEach((event) => {
            console.log(event);
        });
    }

    return outputEvents;
}

function getAllEventsWithId(id, log = false) {
    const eventName = eventNames[id][0];
    let outputEvents = [];

    Object.entries(eventData).forEach((eventType) => {
        const [type, monthDayMap] = eventType;
        for (const [month, days] of Object.entries(monthDayMap)) {
            for (const [day, events] of Object.entries(days)) {
                for (const [iLvl, event] of Object.entries(events)) {
                    for (const [eventId, eventTimes] of Object.entries(event)) {
                        if (eventId == id) {
                            eventTimes.forEach((individualTime) => {
                                outputEvents.push(new LAEvent(id, month, day, individualTime));
                            });
                        }
                    }
                }
            }
        }
    });

    if (log) {
        console.log(`Retrieved all stored times for ${eventName}:`);
        outputEvents.forEach((event) => {
            console.log(event);
        });
    }

    return outputEvents;
}

function getAllEventsWithName(name, log = false) {
    const eventId = Object.keys(eventNames).find(
        (id) => eventNames[id][0] == name
    );
    return getAllEventsWithId(eventId, log);
}

function getAllEventsOnDate(month_, day_, log = false) {
    let outputEvents = [];

    Object.entries(eventData).forEach((eventType) => {
        const [type, monthDayMap] = eventType;
        for (const [month, days] of Object.entries(monthDayMap)) {
            if (month != month_) {
                continue;
            }
            for (const [day, events] of Object.entries(days)) {
                if (day != day_) {
                    continue;
                }
                for (const [iLvl, event] of Object.entries(events)) {
                    for (const [eventId, eventTimes] of Object.entries(event)) {
                        eventTimes.forEach((individualTime) => {
                            outputEvents.push(
                                new LAEvent(eventId, month_, day_, individualTime)
                            );
                        });
                    }
                }
            }
        }
    });

    if (log) {
        console.log(`Retrieved all events occuring on ${months[month_]} ${day_}:`);
        outputEvents.forEach((event) => {
            console.log(event);
        });
    }
}

function filterEventsAfterTime(eventCollection, datetime, log = false) {
    // datetime format should be a string of format MMDDTTTT, where TTTT is military time without the colon
    let outputEvents = eventCollection.filter((lAEvent) => {
        const startMonth = lAEvent.month;
        const startDay = lAEvent.day;
        const startHour = lAEvent.time.slice(0, 2);
        const startMinute = lAEvent.time.slice(3, 5);
        return Number(datetime) <= startMonth * 1000000 + startDay * 10000 + Number(startHour) * 100 + Number(startMinute);
    });

    if (log) {
        console.log(
            `Filtered events occuring on or after ${months[Number(datetime.slice(0, 2))]} ${Number(datetime.slice(2, 4))} at ${datetime
                .toString()
                .slice(4, 6)}:${datetime.toString().slice(6, 8)}`
        );
        outputEvents.forEach((event) => {
            console.log(event);
        });
    }

    return outputEvents;
}

function sortEventsByTime(eventCollection, log = false) {
    // sorts in place
    eventCollection.sort((a, b) => {
        return a.month > b.month // Month
            ? 1
            : a.month < b.month
                ? -1
                : a.day > b.day // Day
                    ? 1
                    : a.day < b.day
                        ? -1
                        : Number(a.time.slice(0, 2)) > Number(b.time.slice(0, 2)) // Hour
                            ? 1
                            : Number(a.time.slice(0, 2)) < Number(b.time.slice(0, 2))
                                ? -11
                                : Number(a.time.slice(3, 5)) > Number(b.time.slice(3, 5)) // Minute
                                    ? 1
                                    : Number(a.time.slice(3, 5)) < Number(b.time.slice(3, 5))
                                        ? -1
                                        : 0;
    });

    if (log) {
        console.log('Sorted provided events by time');
        eventCollection.forEach((event) => {
            console.log(event);
        });
    }

    return null; // return null as a reminder that this sorts in place and modifies the original array
}


module.exports = {
    logAll,
    getAllEventNamesOfType,
    getAllEvents,
    getAllEventsWithId,
    getAllEventsWithName,
    getAllEventsOnDate,
    getAllEventsOfType,
    filterEventsAfterTime,
    sortEventsByTime,
};
