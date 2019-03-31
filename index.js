const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();

const USER_DATA_JSON = require("./mocked_data/user-data.json");
const USER_DATA_PRIVATE_JSON = require("./mocked_data/user-data-private.json");

const USER_OWNED_GAMES_JSON = require("./mocked_data/user-owned-games.json");
const USER_OWNED_GAMES_PRIVATE_JSON = require("./mocked_data/user-owned-games-private.json");

const CUSTOM_STEAMID_JSON = require("./mocked_data/custom-steamid.json");
const ALL_VALID_GAMES_JSON = require("./mocked_data/custom-steamid.json");

const port = 4000;

app.use(cors()); // Not suited for production usage

const jsonParser = bodyParser.json({type: 'application/*+json'});

app.get('/api/user/profile/:steamID/games', function (req, res) {
    res.send();
});

app.get('/api/steam/profile/custom/:steamUsername', function (req, res) {
    res.send(CUSTOM_STEAMID_JSON);
});

app.get('/api/steam/profile/:steamID', function (req, res) {
    const steamID = parseInt(req.params.steamID);
    if (steamID === 1) {
        res.send(USER_DATA_PRIVATE_JSON);
    } else if (steamID === 2) {
        res.send(USER_DATA_JSON);
    } else {
        res.send(USER_DATA_JSON);
    }

});

app.get('/api/steam/profile/:steamID/games', function (req, res) {
    const steamID = parseInt(req.params.steamID);
    if (steamID === 1) {
        res.send(USER_OWNED_GAMES_PRIVATE_JSON);
    } else if (steamID === 2) {
        res.send(USER_OWNED_GAMES_PRIVATE_JSON);
    } else {
        res.send(USER_OWNED_GAMES_JSON);
    }

});

app.post('/api/user/profile/:steamID/games', function (req, res) {
    res.send();
});

app.post('/api/user/profile/:steamID', function (req, res) {
    res.send();
});


app.listen(port, function () {
    console.log('Example app listening on port: ' + port + "!");
});