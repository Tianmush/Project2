const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setTweet = (tweetmsg) => _.escape(tweetmsg).trim();

const TweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  tweetmsg: {
    type: String,
    required: true,
    trim: true,
    set: setTweet,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


TweetSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  tweetmsg:  doc.tweetmsg,
  
 
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
