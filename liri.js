require("dotenv").config();

const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const request = require("request")
const fs = require("fs")
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//commands//my-tweets//spotify-this-song//movie-this//do-what-it-says
var getTweets = function () {
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
}

var spotifyThisSong = function (song) {
    let searchTerm = song || "The Sign Ace of Base"
    spotify.search({
            type: "track",
            query: searchTerm
        })
        .then(function (response) {
            let hit = response.tracks.items[0];
            console.log(`\nArtist(s): ${hit.artists[0].name};
                        \nSong name: ${hit.name};
                        \nPreview: ${hit.preview_url};
                        \nAlbum: ${hit.album.name}\n`)
        })
        .catch(err => console.log(err));
}

var movieThis = function (movie) {
    let search= movie || "Mr.Nobody"
    request(`http://www.omdbapi.com/?apikey=trilogy&t=${search}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let info = JSON.parse(body);
            console.log(`\nMovie Title: ${info.Title};            
                        \nYear: ${info.Year}
                        \nIMDB Rating: ${info.imdbRating}
                        \nRotton Tomatoes Rating: ${info.Ratings[1].Value}
                        \nProduced in: ${info.Country}
                        \nLanguage: ${info.Language}
                        \nPlot: ${info.Plot}
                        \nActors: ${info.Actors}\n`)
        };
    });

}


switch(process.argv[2]){
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong(process.argv[3])
        break;
    case "movie-this":
        movieThis(process.argv[3]);
        break;
    case "do-what-it-says":
        fs.readFile('./random.txt', "UTF-8", (err, data) => {
            if (err) throw err;
            let commands = data.split(",")[0];
            let content = data.split(",")[1];
            switch(commands){
                case "my-tweets":
                    getTweets();
                    break;
                case "spotify-this-song":
                    spotifyThisSong(content)
                    break;
                case "movie-this":
                    movieThis(content);
                    break;
                        
                }

        })
}


