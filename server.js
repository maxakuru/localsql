const dbName = 'MapData',
    tableNames = {
        events: 'defaultConferenceEvents',
        sessions: 'sessions',
        rooms: 'rooms',
        poi: 'poi'
    },
    idNames = {
        events: 'eventId', // index doesn't exist
        sessions: 'DessionReferenceID',
        rooms: 'RoomId',
        poi: 'POIID'
    },
    port = process.env.PORT || 9999;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`data/${dbName}.db`);
const express = require('express');
const api = express();

api.get('/sessions', (req, res) => {
    db.all(`SELECT * FROM ${tableNames.sessions}`, 
        (err, all) => {
            if(err) {
                res.status(503);
                res.send('No good, sorry m8.');
            }
            res.json({ "sessions" : all });
    });
});

api.get('/sessions/:session_id', (req, res) => {
    db.get(`SELECT * FROM ${tableNames.sessions} WHERE ${idNames.sessions} = ${req.params.session_id}`, 
        (err, row) => {
            if(err) {
                res.status(503);
                res.send('No good, sorry m8.');
            }
            res.json({ "session" : row });
    });
});


api.listen(port);

console.log(`API running on port localhost:${port}`);