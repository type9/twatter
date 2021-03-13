# Twatter
fake twitter for fake tweets

[HOSTED HERE](https://twittertwat.herokuapp.com/)

## What is this?

Twatter is an app that tries to replicate speech patterns through generating a new tweet from a given Twitter handle.

**FYI on Usage**... You need to give it a twitter handle that has a lot of Tweets. If there aren't too many Tweets there's a high chance that the site will just return a copy of a tweet

---
## API

### Quickstart

**Generating a tweet:** 

This route takes a valid twitter handle and forwards you to a unique url that displays that Tweet data
`/<twitterhandle>/generate`

**Getting a tweet by ID:** 

This route will display the data pertaining to a given tweetId from a specific handle.
`/<twitterhandle>/<tweetId>`

**Get all Tweets already generated from a handle:** 

This route will give a list of all the Tweets previously generated under a certain handle
`/<twitterhandle>`



### Example Data

Here's an overview of the data covered so far

```json
{
    // 20200306142442
    // https://twittertwat.herokuapp.com/elonmusk
    "tweets": [
        {
        "retweets": [
            
        ],
        "_id": "5e62cbbe5ab42b0013402a3d",
        "text": "Falcon Heavy will study a good . ",
        "__v": 0
        },
        {
        "retweets": [
            
        ],
        "_id": "5e62c42c5ab42b0013402a3c",
        "text": "Bernie ’ s tax rate is dumb ",
        "__v": 0
        },
        {
        "retweets": [
            
        ],
        "_id": "5e62c4165ab42b0013402a3b",
        "text": "Starship SN1 tank preparing for the formation of the makers of range.https :/ / www.teslarati.com/tesla-model-s-model-x-range-boost-ota/ … ",
        "__v": 0
        }
    ],
    "_id": "5e62bf4aaaf7bb00175978d6",
    "name": "elonmusk",
    "__v": 3
}
```

### Retweeting with API Key

**Get an API Key:** 

Generates a unique new API Key. Use this as a url parameter to access the other user features.
`/user/newkey`

**Retweet:** 

Reweet a Tweet in the format of the below url. It will return 200 on success.
`/user/retweet/<tweetId>/?key=<YOURKEYHERE>`

**Your retweets:** 

Now your Retweets can be seen from the following endpoint.
`/user/retweets`

**Seeing other retweets:** 

Retweets are part of the json data of each tweet object. The IDs are just user IDs but you can count the retweets to see the "popularity" of that quote.
