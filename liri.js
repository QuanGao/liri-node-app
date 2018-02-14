require("dotenv").config();

const keys = require("./keys.js");
const request = require("request")
const fs = require("fs")

let addInfoToLog = function(info){
    fs.appendFile("log.txt", info, (err) => {
        if (err) throw err;
    })
}
let getTweets = function () {
    const Twitter = require('twitter');
    const client = new Twitter(keys.twitter);
    const params = {
        count: 20,
        screen_name: "QuanGaoG"
    };
    console.log("Here're the 20 latest tweets")
    client.get("statuses/user_timeline", params)
        .then(function (tweets) {
            for (let i = 0; i < tweets.length; i++) {
                let el = tweets[i];
                let msg = `\nAt ${el.created_at}, ${el.user.name} tweeted "${el.text}"`
                console.log(msg);
                fs.appendFile("log.txt", msg, (err) => {
                    if (err) throw err;
                })
            }
        })
        .catch(function (error) {
            throw error;
        })
}

let spotifyThisSong = function (song) {
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    let searchTerm = song || "The Sign Ace of Base"
    spotify.search({
            type: "track",
            query: searchTerm
        })
        .then(function (response) {
            let hit = response.tracks.items[0];
            let songInfo = `\nArtist(s): ${hit.artists[0].name};
                            \nSong name: ${hit.name};
                            \nPreview: ${hit.preview_url};
                            \nAlbum: ${hit.album.name}\n`
            console.log(songInfo);
            addInfoToLog(songInfo)
        })
        .catch(err => console.log(err));
}

let movieThis = function (movie) {
    let search = movie || "Mr.Nobody"
    request(`http://www.omdbapi.com/?apikey=trilogy&t=${search}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let info = JSON.parse(body);
            var movieInfo = `\nMovie Title: ${info.Title};            
                            \nYear: ${info.Year}
                            \nIMDB Rating: ${info.imdbRating}
                            \nRotton Tomatoes Rating: ${info.Ratings[1].Value}
                            \nProduced in: ${info.Country}
                            \nLanguage: ${info.Language}
                            \nPlot: ${info.Plot}
                            \nActors: ${info.Actors}\n`
            console.log(movieInfo);
            addInfoToLog(movieInfo)

        };
    });
}

let listenToCommands = function (command, item) {
    switch (command) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            spotifyThisSong(item)
            break;
        case "movie-this":
            movieThis(item);
            break;
        default:
            console.log("sorry, I don't quite understand you");
    }
}

switch (process.argv[2]) {
    case "do-what-it-says":
        fs.readFile('./random.txt', "UTF-8", (err, data) => {
            if (err) throw err;
            listenToCommands(data.split(",")[0], data.split(",")[1]);
        });
        break;
    default:
        listenToCommands(process.argv[2], process.argv[3]);
}