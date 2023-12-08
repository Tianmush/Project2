const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setMessage = (message) => _.escape(message).trim();
const TweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  message: {
    type: String,
    trim: true,
    set:setMessage,
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
  message: doc.message,
 
});

const TweetModel = mongoose.model('Tweet', TweetSchema);
module.exports = TweetModel;
