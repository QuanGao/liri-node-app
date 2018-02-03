require("dotenv").config();

const keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var commmands = process.argv[2];
var item = process.argv[3];

//commands//my-tweets//spotify-this-song//movie-this//do-what-it-says



