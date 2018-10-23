"use strict";
const dbName = 'data.db',
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
const db = new sqlite3.Database(`${__dirname}/data/${dbName}`);
const express = require('express');
const api = express();

api.get(`/favicon.ico`, (req,res) => {
    res.status(404);
});

api.get(`*`, (req, res) => {
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
                    let returnObj = {};
                    returnObj[route] = all;
                    res.json(returnObj);
                }
        });
    }
});


api.listen(port);

console.log(`API running on port localhost:${port}`);
