const dbName = 'MapData',
    tableNames = {
        events: 'defaultConferenceEvents',
        sessions: 'sessions',
        rooms: 'rooms',
        pois: 'poi'
    },
    idNames = {
        events: 'eventId', // index doesn't exist
        sessions: 'SessionReferenceID',
        rooms: 'RoomId',
        pois: 'POIID'
    },
    port = process.env.PORT || 9999;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(`data/${dbName}.db`);
const express = require('express');
const api = express();

api.get(`*/*`, (req, res) => {
    const route = req.url.split('/')[1],
        singular = route.slice(0, -1),
        param = req.url.split('/')[2];
    db.get(`SELECT * FROM ${tableNames[route]} WHERE ${idNames[route]} = ${param}`, 
        (err, row) => {
            if(err) {
                res.status(503);
                res.send('No good, sorry m8.');
            }
            res.json({ singular : row });
    });
});

api.get('*', (req, res) => {
    const route = req.url.split('/')[1];
    db.all(`SELECT * FROM ${tableNames[route]}`, 
        (err, all) => {
            if(err) {
                res.status(503);
                res.send('No good, sorry m8.');
            }
            res.json({ route : all });
    });
});


api.listen(port);

console.log(`API running on port localhost:${port}`);