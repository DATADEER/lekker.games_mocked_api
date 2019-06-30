const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const rateLimit = require("express-rate-limit");
const { range, interval, zip } = require("rxjs");
const {
  map,
  mergeMap,
  pluck,
  take,
  bufferCount,
  windowCount,
  concatMap,
  concatAll,
  retry,
  tap
} = require("rxjs/operators");
const axios = require("axios-observable").Axios;
const colors = require("colors");

const USER_DATA_JSON = require("./mocked_data/user-data.json");
const USER_DATA_PRIVATE_JSON = require("./mocked_data/user-data-private.json");

const USER_OWNED_GAMES_JSON = require("./mocked_data/user-owned-games.json");
const USER_OWNED_GAMES_PRIVATE_JSON = require("./mocked_data/user-owned-games-private.json");

const CUSTOM_STEAMID_JSON = require("./mocked_data/custom-steamid.json");
const ALL_VALID_GAMES_JSON = require("./mocked_data/custom-steamid.json");

const USERS_JSON = require("./mocked_data/users.json");

const port = 4000;

app.use(cors()); // Not suited for production usage

const jsonParser = bodyParser.json({ type: "application/*+json" });

app.get("/api/user/profile/:steamID/games", function(req, res) {
  res.send();
});

app.get("/api/steam/profile/custom/:steamUsername", function(req, res) {
  res.send(CUSTOM_STEAMID_JSON);
});

app.get("/api/steam/profile/:steamID", function(req, res) {
  const steamID = parseInt(req.params.steamID);
  if (steamID === 1) {
    res.send(USER_DATA_PRIVATE_JSON);
  } else if (steamID === 2) {
    res.send(USER_DATA_JSON);
  } else {
    res.send(USER_DATA_JSON);
  }
});

app.get("/api/steam/profile/:steamID/games", function(req, res) {
  const steamID = parseInt(req.params.steamID);
  if (steamID === 1) {
    res.send(USER_OWNED_GAMES_PRIVATE_JSON);
  } else if (steamID === 2) {
    res.send(USER_OWNED_GAMES_PRIVATE_JSON);
  } else {
    res.send(USER_OWNED_GAMES_JSON);
  }
});

app.post("/api/user/profile/:steamID/games", function(req, res) {
  res.send();
});

app.post("/api/user/profile/:steamID", function(req, res) {
  res.send();
});

const limiter = rateLimit({
  windowMs: 1000,
  max: 4
});

app.get("/limited/:id", limiter, function(req, res) {
  const id = req.params.id;
  if (parseInt(id) === 3) {
    console.log("NICE");
    throw Error("IDK");
    res.status(500).send("AWAS");
  } else {
    res.send(USERS_JSON[id]);
  }
});

app.get("/try", limiter, function(req, res) {
  console.log("starting");
  const baseURL = "http://localhost:4000";
  const $urls = range(0, 100).pipe(map(value => `${baseURL}/limited/${value}`));

  const requests$ = zip(
    $urls.pipe(bufferCount(4)),
    interval(1000),
    (a, b) => a
  ).pipe(
    concatAll(),
    concatMap(url => axios.get(url)),
    retry(3),
    pluck("data")
  );

  requests$.subscribe(
    value => {
      console.log("response", value);
    },
    error => {
      if (error.response && error.response.status) {
        console.log(
          colors.red(
            error.response.status,
            error.response.statusText,
            error.response.message
          )
        );
      } else {
        console.log(colors.red(error));
      }
    },
    () => {
      console.log("COMPLETE");
      res.send("COMPLETE");
    }
  );
});

app.listen(port, function() {
  console.log("Mocked API is listening on port: " + port + "!");
});
