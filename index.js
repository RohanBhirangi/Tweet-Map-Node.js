const express = require("express");
const app = express();

const Twitter = require("twitter");
const config = require("./config.js");
const readline = require("readline");
const fs = require("fs");

const client = new Twitter(config);

const locations = "-180,-90,180,90";

client.stream("statuses/filter", { locations: locations }, stream => {
  stream.on("data", tweet => {
    if (tweet.coordinates && tweet.coordinates.type === "Point") {
      fs.appendFile(
        "tweets.txt",
        JSON.stringify({
          tweet: tweet.text,
          coordinates: tweet.coordinates.coordinates
        }) + "\n",
        err => {
          if (err) console.log(err);
        }
      );
      console.log(tweet.coordinates.coordinates);
    }
  });

  stream.on("error", error => {
    console.log(error);
  });
});

app.get("/tweets", async (req, res, next) => {
  let responseData = fs
    .readFileSync("tweets.txt")
    .toString()
    .split("\n");
  fs.unlink("tweets.txt", err => console.log(err));
  res.send(responseData);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
