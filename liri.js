//env variables
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const NodeGeocoder = require("node-geocoder");

require("dotenv").config();

//spotify keys
var keys = require("./keys.js");
//spotify cnx
var spotify = new Spotify(keys.spotify);

//building MAPQuest infos
var options = {
  provider: "mapquest",
  apiKey: process.env.MAPQUEST_KEY,
};

// geocoder object to can query the mapquest API
const geocoder = NodeGeocoder(options);

//getting the command line inputs 
const command = process.argv[2];
const userInput = process.argv.splice(3, process.argv.length).join("+");

//random.txt name easy to access tru filename in case we dealing with not static file.
var fileName = "random.txt";
var mode = "utf8";

//function log();
const log = () => {
  const logline = (moment().format("dddd, MMMM Do YYYY, h:mm:ss a")) + " - " + command + " - " + userInput;
  fs.appendFile("log.txt", `${logline} \n`, (error) => {
    if (error) {
      console.log(`Error log file: ${error}`);
    }
  });
}

//function concert-this
const concertThis = (input) => {  
  //check if the function was called with an argument
  let search=(input)?input:"Passenger";
  const concertquery = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
  //console.log(concertquery);
  axios
    .get(concertquery)
    .then(({
      data
    }) => {
      //loop to display events
      data.forEach(data => {

        /* const city = data.venue.city;
        const region = data.venue.region;
        const country = data.venue.country; */
       
        let address = "";
        let city = "";
        let state = "";
        let country = data.venue.country;
        // we will use latitude and longitude to build a query for Geocode
        const latitude = data.venue.latitude;
        const longitude = data.venue.longitude;
        //var location to store the result from geocoder
        
        geocoder.reverse({
            lat: latitude,
            lon: longitude
          })
          .then((location) => {
            //console.log(location);
            //console.log(location[0]["streetName"]);
            //console.log(`c: ${data.venue.city}|| r: ${data.venue.region}||c: ${data.venue.country}|| `);
            //get the value out of $location
            address = location[0]["streetName"];
            city = location[0]["city"];
            state = (location[0]["zipcode"]!=="")?location[0]["zipcode"]:"-";

            //display infos
            console.log("🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺");
            console.log(`Venue name: ${data.venue.name}`);
            
            console.log(`Venue address: ${address},
               ${city}, ${state}, ${country}`);

            //console.log(`Venue location: ${city} , ${state}, ${country}`);           
            const dateFormatted = moment(data.datetime).format("MM/DD/YYYY");
            console.log(`Concert date: ${dateFormatted}`);
            console.log("🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺🕺");

          })
          .catch((err) => {
            console.log(err);
          });


      });
    });
  //write in log.txt
  log();
}
//function spotify this song
const spotifyThisSong = (input) => {
  //check if the function was called with an argument
  let search=(input)?input:"The+Sign";
  console.log(search);
  //
  spotify
    .search({
      type: 'track',
      query: search
    })
    .then(({
      tracks: {
        items
      }
    }) => { //destruturing at the two levels down
      //console.log(items);
      items.forEach(item => {
        //in case of multiple artists feat
        var artists = "";
        var artistsNumber = Object.keys(item.artists).length;

        if (artistsNumber > 1) {
          for (var key in item.artists) {
            artists += item.artists[key].name + " ";
          }
        } else {
          for (var key in item.artists) {
            artists += item.artists[key].name;
          }
        }
        console.log("♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪");
        console.log(`Song title: ${item.name} `);
        console.log(`Artist(s) Number: ${artistsNumber}`);
        console.log(`Artist(s): ${artists}`);
        console.log(`Preview link: ${item.href}`);
        console.log(`Album: ${item.album.name}`);
        console.log(`♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪`);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  //write in the log
  log();
}
//function movie-this
const movieThis = (input) => {
  //check if the function was called with an argument
  let search=(input)?input:"Mr+Nobody";
  const moviequery = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=5fe6525f";
  //console.log(queryUrl);
  axios
    .get(moviequery)
    .then(({
      data
    }) => { //destructuration

      if (data) {
        //console.log(data);
        console.log("🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥Movie Infos🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥");
        console.log(`Movie title: ${data.Title}`);
        console.log(`Release Date: ${data.Year}`);
        console.log(`IMBD Ratings: ${data.Ratings[0].Value}`);

        const rottenRatings = (data.Ratings[1]) ? data.Ratings[1].Value : "Not available!";

        console.log(`Rotten Tomatoes Ratings: ${rottenRatings}`);
        console.log(`Country : ${data.Country}`);
        console.log(`Language : ${data.Language}`);
        console.log(`Movie Plot : ${data.Plot}`);
        console.log(`Actors : ${data.Actors}`);
        console.log("🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥🎥");
      }
    })
    .catch((err) => console.log(err));
  //write in the log
  log();

}
//function do-what-it-says
const doWhatItSays = () => {
  fs.readFile(fileName, mode, (error, data) => {
    if (error) {
      return console.log(`Error reading file: ${error}`);
    }
    //slipt data in the file
    var dataSplit = data.split(':');

    //get the content of datasplit 
    const todo = dataSplit[0].trim(); 
    const todoInput = dataSplit[1].trim();

    console.log(`Command to run: ${todo}`);
    console.log(`Argument found in file: ${todoInput}`);
    //then swith case
    switch (todo) {
      case "concert-this":
        return concertThis(todoInput);

      case "spotify-this-song":
        return spotifyThisSong(todoInput);
        
      case "movie-this":
        return movieThis(todoInput);
    }
    //write in the log
    log();
  });
}

//core of the app
switch (command) {
  case "concert-this":
    return concertThis(userInput);

  case "spotify-this-song":
    return spotifyThisSong(userInput);

  case "movie-this":
    return movieThis(userInput);

  case "do-what-it-says":
    return doWhatItSays();

  default:
    console.log("Please! Input a valid command.");
}