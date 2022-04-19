/* eslint-disable no-unused-vars */

/* Unused data files
const itemMap = require("./data/itemMapping.json");
const itemRarity = require("./data/itemRarity.json");
const merchants = require("./data/merchants.json");
const merchantSchedules = require("./data/merchantSchedules.json");
*/

const eventData = require('./data/data.json');
const eventNames = require('./data/events.json');
const eventTypes = require('./data/msgs.json');
const { months } = require('./constants.js');

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

function filterEventsAfterTime(eventCollection, time, log = false) {
    // use a four digit military time without the colon
    let outputEvents = eventCollection.filter((lAEvent) => {
        const startHour = lAEvent.time.slice(0, 2);
        const startMinute = lAEvent.time.slice(3, 5);
        return time <= Number(startHour) * 100 + Number(startMinute);
    });

    if (log) {
        console.log(
            `Filtered events occuring on or after ${time
                .toString()
                .slice(0, 2)}:${time.toString().slice(2, 4)}`
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
    getAllEvents,
    getAllEventsWithId,
    getAllEventsWithName,
    getAllEventsOnDate,
    filterEventsAfterTime,
    sortEventsByTime,
};
