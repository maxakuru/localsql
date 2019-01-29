"use strict";
const dbName = 'data.db',
    tableNames = {
        sessions: 'Sessions',
        talks: 'Talks',
        events: 'Events'
    },
    idNames = {
        events: 'eventId', 
        sessions: 'sessionId',
        talks: 'talkId'
    },
    port = process.env.PORT || 9999;
console.log(`${__dirname}/data/${dbName}`);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`${__dirname}/data/${dbName}`);
const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
                    "Origin, X-Rquested-With, Content-Type, Accept");
    next();
});

app.get(`/favicon.ico`, (req,res) => {
    res.status(404);
});

const backupCall = () => {

}

app.get(`/sessions/:id`, (req, res) => {
    console.log('Session - Request: ', `SELECT * FROM ${tableNames.sessions} WHERE ${idNames.sessions} = ${req.params.id}`);
    // db.all(`SELECT * FROM Sessions LEFT JOIN Talks ON Talks.sessionId=Sessions.sessionId WHERE Sessions.sessionId=${req.params.id}`, 
    db.all(`SELECT Sessions.sessionId AS id,
                    Sessions.sessionType,
                    Sessions.track,
                    Sessions.title AS sessionTitle,
                    Sessions.description AS sessionDescription,
                    Sessions.startDateTime,
                    Sessions.endDateTime,
                    Sessions.location,
                    Sessions.building,
                    Sessions.roomNumber,
                    Sessions.video,
                    Sessions.speakerNames as sessionSpeakerNames,
                    Sessions.speakers as sessionSpeakers,
                    Talks.title AS talkTitle,
                    Talks.description AS talkDescription,
                    Talks.keywords AS talkKeywords,
                    Talks.speakers AS talkSpeakers
            FROM Sessions
                JOIN Talks
                    ON Sessions.sessionId = Talks.sessionId
                    WHERE Sessions.sessionId = "${req.params.id}"`,
        (err, row) => {
            console.log('row: ', row);
            if(err) {
                console.log('error: ', err);
                res.status(503);
                res.send('No good, sorry m8.');
            } 
            else {
                if(row.length === 0) {
                    console.log('Got nothing, try: ');
                    const callWithoutTalks = `SELECT Sessions.sessionId AS id,
                            Sessions.sessionType,
                            Sessions.track,
                            Sessions.title AS sessionTitle,
                            Sessions.description AS sessionDescription,
                            Sessions.startDateTime,
                            Sessions.endDateTime,
                            Sessions.location,
                            Sessions.building,
                            Sessions.roomNumber,
                            Sessions.video,
                            Sessions.speakerNames as sessionSpeakerNames,
                            Sessions.speakers as sessionSpeakers
                    FROM Sessions
                        WHERE Sessions.sessionId = "${req.params.id}"`;
                    console.log(callWithoutTalks);
                    db.all(callWithoutTalks,
                        (err2, row2) => {
                            console.log('row2: ', row2);
                            if(err) {
                                console.log('error2: ', err2);
                                res.status(503);
                                res.send('No good, sorry m8.');
                            } 
                            else {
                                res.status(200);
                                res.json({
                                    'session': row2
                                });
                            }
                        }
                    );
                } 
                else {
                    res.status(200);
                    res.json({
                        'session': row
                    });
                }
            }
    });
});

app.get(`/events/:id`, (req, res) => {
    console.log('Event - Request: ', `SELECT * FROM ${tableNames.events} WHERE ${idNames.events} = ${req.params.id}`);
    db.get(`SELECT * FROM ${tableNames.events} WHERE ${idNames.events} = "${req.params.id}"`, 
        (err, row) => {
            console.log('row: ', row);
            if(err) {
                console.log('error: ', err);
                res.status(503);
                res.send('No good, sorry m8.');
            } 
            else {
                res.status(200);
                res.json({
                    'event': row
                });
            }
    });
});

app.get(`*`, (req, res) => {
    const route = req.url.split('/')[1],
        singular = route.slice(0, -1),
        param = req.url.split('/')[2];
    if(param){
        console.log('Request: ', `SELECT * FROM ${tableNames[route]} WHERE ${idNames[route]} = ${param}`);
        db.get(`SELECT * FROM ${tableNames[route]} WHERE ${idNames[route]} = ${param}`, 
            (err, row) => {
                if(err) {
                    console.log('error: ', err);
                    res.status(503);
                    res.send('No good, sorry m8.');
                } 
                else {
                    res.status(200);
                    let returnObj = {};
                    returnObj[singular] = row;
                    res.json(returnObj);
                }
        });
    }
    else {
        console.log('Request: ', `SELECT * FROM ${tableNames[route]}`);
        db.all(`SELECT * FROM ${tableNames[route]}`, 
            (err, all) => {
                if(err) {
                    console.log('error: ', err);
                    res.status(503);
                    res.send('No good, sorry m8.');
                }
                else{
                    res.status(200);
                    let returnObj = {};
                    returnObj[route] = all;
                    res.json(returnObj);
                }
        });
    }
});


app.listen(port);

console.log(`API running on port localhost:${port}`);
