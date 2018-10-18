# LocalSQL

Super simple server to get things from a local SQLite file.

`npm install && npm start`

Table names should end with an `s` like `sessions`, `events`, etc

Get a single event:
`GET /events/:event_id`

Get all events:
`GET /events`
