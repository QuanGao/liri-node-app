require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require("request")

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//commands//my-tweets//spotify-this-song//movie-this//do-what-it-says

switch (process.argv[2]) {
    case "my-tweets":
        const params = {
            count: 20,
            screen_name: "QuanGaoG"
        };
        console.log("Here're the 20 latest tweets")
        client.get("statuses/user_timeline", params)
            .then(function (tweets) {
                for (let i = 0; i < tweets.length; i++) {
                    let el = tweets[i];
                    console.log(`\nAt ${el.created_at}, ${el.user.name} tweeted "${el.text}"`);
                }
            })
            .catch(function (error) {
                throw error;
            })
        break;
    case "spotify-this-song":
        let song = process.argv[3] || "The Sign Ace of Base"
        spotify.search({
                type: "track",
                query: song
            })
            .then(function (response) {
                let hit = response.tracks.items[0];
                console.log(`\nArtist(s): ${hit.artists[0].name};
                    \nSong name: ${hit.name};
                    \nPreview: ${hit.preview_url};
                    \nAlbum: ${hit.album.name}\n`)
            })
            .catch(err => console.log(err))
    case "movie-this":
        let movie = process.argv[3] || "Mr.Nobody"
        request(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let info = JSON.parse(body);
                console.log(`\nMovie Title: ${info.Title};            
                    \nYear: ${info.Year}
                    \nIMDB Rating: ${info.imdbRating}
                    \nRotton Tomatoes Rating: ${info.Ratings[1].Value}
                    \nProduced in: ${info.Country}
                    \nLanguage: ${info.Language}
                    \nPlot: ${info.Plot}
                    \nActors: ${info.Actors}\n`
                )         
            };
        })
    }